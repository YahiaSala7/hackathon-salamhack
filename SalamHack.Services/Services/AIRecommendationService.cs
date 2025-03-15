﻿using SalamHack.Data.DTOS.Recommendation;
using SalamHack.Data.Repositories;
using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;

namespace SalamHack.Services.Services
{
    public class AIRecommendationService : IAIRecommendationService
    {
        private readonly IAIClient _aiClient;
        private readonly IProjectRepository _projectRepository;
        private readonly RoomRepository _roomRepository;
        private readonly IFurnitureRepository _furnitureRepository;

        public AIRecommendationService(
            IAIClient aiClient,
            IProjectRepository projectRepository,
            IRoomRepository roomRepository,
            IFurnitureRepository furnitureRepository)
        {
            _aiClient = aiClient;
            _projectRepository = projectRepository;
            _roomRepository = roomRepository;
            _furnitureRepository = furnitureRepository;
        }

        public async Task<AIRecommendationResponseDto> GetRecommendationsAsync(int projectId, int? roomId = null)
        {
            // Get project or room-specific recommendations from AI
            var recommendations = await _aiClient.GetRecommendationsAsync(projectId, roomId);

            // Process these recommendations and potentially save them to the database
            if (recommendations.FurnitureRecommendations != null && recommendations.FurnitureRecommendations.Any())
            {
                foreach (var recommendation in recommendations.FurnitureRecommendations)
                {
                    if (recommendation.RoomId.HasValue)
                    {
                        // Create furniture items based on AI recommendations
                        var furniture = new Furniture
                        {
                            RoomId = recommendation.RoomId.Value,
                            Name = recommendation.Name,
                            Category = recommendation.Category,
                            Price = recommendation.EstimatedPrice,
                            StoreLink = recommendation.PreferredStore
                        };
                        // Only add if there isn't already similar furniture
                        var existingFurniture = await _furnitureRepository.GetByRoomIdAsync(recommendation.RoomId.Value);
                        if (!existingFurniture.Any(f =>
                            f.Category == furniture.Category &&
                            f.Name.ToLower().Contains(furniture.Name.ToLower())))
                        {
                            await _furnitureRepository.CreateAsync(furniture);
                        }
                    }
                }
            }

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
