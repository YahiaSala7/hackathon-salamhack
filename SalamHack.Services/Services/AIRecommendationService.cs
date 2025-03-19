using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SalamHack.Data.DTOS.Recommendation;
using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;
using SalamHack.Services.Interfaces;

namespace SalamHack.Services.Services
{
    public class AIRecommendationService : IAIRecommendationService
    {
        private readonly IAIClient _aiClient;
        private readonly IProjectRepository _projectRepository;
        private readonly IRoomRepository _roomRepository;
        private readonly IFurnitureRepository _furnitureRepository;
        private readonly IMemoryCache _cache;
        private readonly ILogger<AIRecommendationService> _logger;
        public AIRecommendationService(IMemoryCache cache,
            IAIClient aiClient,
            IProjectRepository projectRepository,
            IRoomRepository roomRepository,
            IFurnitureRepository furnitureRepository,
              ILogger<AIRecommendationService> logger)
        {
            _cache = cache;
            _aiClient = aiClient;
            _projectRepository = projectRepository;
            _roomRepository = roomRepository;
            _furnitureRepository = furnitureRepository;
            _logger = logger;
        }

        public async Task<AIRecommendationResponseDto> GetRecommendationsAsync(int projectId, int? roomId = null)
        {
            // Generate unique cache key
            string cacheKey = $"ai_recommendations_{projectId}_{roomId?.ToString() ?? "all"}";

            // Attempt to get cached recommendations
            if (_cache.TryGetValue(cacheKey, out AIRecommendationResponseDto cachedRecommendations))
            {
                _logger.LogInformation($"Returning cached recommendations for {cacheKey}");
                return cachedRecommendations;
            }

            // Get project details for context
            var project = await _projectRepository.GetProjectWithDetailsAsync(projectId);
            if (project == null)
                throw new ArgumentException("Project not found");

            // Get fresh recommendations from AI
            var recommendations = await _aiClient.GetRecommendationsAsync(projectId, roomId);

            // Process furniture recommendations
            if (recommendations.FurnitureRecommendations?.Any() == true)
            {
                foreach (var recommendation in recommendations.FurnitureRecommendations)
                {
                    if (!recommendation.RoomId.HasValue) continue;

                    var room = await _roomRepository.GetByIdAsync(recommendation.RoomId.Value);
                    if (room == null) continue;

                    var existingFurniture = await _furnitureRepository.GetByRoomIdAsync(recommendation.RoomId.Value);

                    if (!existingFurniture.Any(f =>
                        f.Category.Equals(recommendation.Category, StringComparison.OrdinalIgnoreCase) &&
                        f.Name.Contains(recommendation.Name, StringComparison.OrdinalIgnoreCase)))
                    {
                        var newFurniture = new Furniture
                        {
                            RoomId = recommendation.RoomId.Value,
                            Name = recommendation.Name,
                            Category = recommendation.Category,
                            Price = recommendation.EstimatedPrice,
                            StoreLink = recommendation.PreferredStore,
                            Description = recommendation.RecommendationReason
                        };
                        await _furnitureRepository.CreateAsync(newFurniture);
                    }
                }
            }

            // Process budget recommendations
            if (recommendations.RoomBudgetRecommendations?.Any() == true)
            {
                foreach (var budgetRec in recommendations.RoomBudgetRecommendations)
                {
                    var room = await _roomRepository.GetByIdAsync(budgetRec.RoomId);
                    if (room == null || room.ProjectId != projectId) continue;

                    var budgetDifference = Math.Abs(room.RoomBudget - budgetRec.RecommendedBudget);
                    if (budgetDifference / room.RoomBudget > 0.05m)
                    {
                        room.RoomBudget = budgetRec.RecommendedBudget;
                        await _roomRepository.UpdateAsync(room);

                        // Invalidate cache for updated room
                        _cache.Remove($"ai_recommendations_{projectId}_{room.RoomId}");
                    }
                }
            }

            // Cache the results with expiration
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(30))
                .RegisterPostEvictionCallback((key, value, reason, state) =>
                {
                    _logger.LogInformation($"Cache entry {key} evicted due to {reason}");
                });

            _cache.Set(cacheKey, recommendations, cacheOptions);

            return recommendations;
        }
        public async Task<bool> ApplyRecommendationsAsync(int projectId, AIRecommendationResponseDto recommendations)
        {
            try
            {
                var project = await _projectRepository.GetProjectWithDetailsAsync(projectId);
                if (project == null)
                    return false;

                // Apply room budget recommendations if provided
                if (recommendations.RoomBudgetRecommendations != null && recommendations.RoomBudgetRecommendations.Any())
                {
                    foreach (var budgetRec in recommendations.RoomBudgetRecommendations)
                    {
                        var room = await _roomRepository.GetByIdAsync(budgetRec.RoomId);
                        if (room != null)
                        {
                            room.RoomBudget = budgetRec.RecommendedBudget;
                            await _roomRepository.UpdateAsync(room);
                        }
                    }
                }

                // Apply furniture recommendations if provided and approved
                if (recommendations.FurnitureRecommendations != null && recommendations.FurnitureRecommendations.Any())
                {
                    foreach (var furnitureRec in recommendations.FurnitureRecommendations)
                    {
                        if (furnitureRec.IsApproved && furnitureRec.RoomId.HasValue)
                        {
                            var furniture = new Furniture
                            {
                                RoomId = furnitureRec.RoomId.Value,
                                Name = furnitureRec.Name,
                                Category = furnitureRec.Category,
                                Price = furnitureRec.EstimatedPrice,
                                StoreLink = furnitureRec.PreferredStore
                            };

                            await _furnitureRepository.CreateAsync(furniture);
                        }
                    }
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }

}
