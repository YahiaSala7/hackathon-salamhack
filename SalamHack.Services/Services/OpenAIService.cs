using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SalamHack.Data.DTOS.Recommendation;
using SalamHack.Models;
using SalamHack.Services.Interfaces;
using System.Text;

namespace SalamHack.Services.Services
{
    public class OpenAIService : IOpenAIService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<OpenAIService> _logger;
        private readonly string _apiKey;
        private readonly string _apiUrl;

        public OpenAIService(HttpClient httpClient, IConfiguration configuration, ILogger<OpenAIService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
            _apiKey = _configuration["OpenAI:ApiKey"];
            _apiUrl = _configuration["OpenAI:ApiUrl"];

            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        }

        public async Task<AIRecommendationResponseDto> GetFurnitureRecommendations(Project project, List<Room> rooms = null)
        {
            try
            {
                var prompt = BuildRecommendationPrompt(project, rooms);

                var requestBody = new
                {
                    model = "gpt-4",
                    messages = new[]
                    {
                           new { role = "system", content = "You are an interior design expert helping users design their home by recommending furniture and appliances based on their budget and preferences." },
                           new { role = "user", content = prompt }
                       },
                    temperature = 0.7,
                    max_tokens = 1500
                };

                var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(_apiUrl, content);
                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync();
                var responseObj = JsonConvert.DeserializeObject<dynamic>(responseString);
                var aiResponse = responseObj.choices[0].message.content.ToString();

                // Parse AI response into recommendation object
                return ParseAIRecommendationResponse(aiResponse, project.Budget);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting furniture recommendations from OpenAI");
                throw;
            }
        }

        public async Task<string> GenerateRoomDescription(Room room)
        {
            try
            {
                var prompt = $"Describe the ideal layout and styling for a {room.RoomType} with an area of {room.RoomSize} square meters and a budget of {room.RoomBudget:C}. " +
                    $"Consider the overall home style preference of the project which is {room.Project.StylePreference}.";

                var requestBody = new
                {
                    model = "gpt-4",
                    messages = new[]
                    {
                        new { role = "system", content = "You are an interior design expert providing detailed descriptions of room setups." },
                        new { role = "user", content = prompt }
                    },
                    temperature = 0.7,
                    max_tokens = 500
                };

                var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(_apiUrl, content);
                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync();
                var responseObj = JsonConvert.DeserializeObject<dynamic>(responseString);
                return responseObj.choices[0].message.content.ToString();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating room description from OpenAI");
                throw;
            }
        }

        public async Task<string> GenerateReportSummary(Project project)
        {
            try
            {
                var prompt = $"Generate a concise summary of the home setup project with the following details: " +
                    $"Budget: {project.Budget:C}, " +
                    $"Home Size: {project.HomeSize} square meters, " +
                    $"Location: {project.Location}, " +
                    $"Style Preference: {project.StylePreference}, " +
                    $"Room Count: {project.RoomCount}. " +
                    $"The summary should highlight the key features and strengths of the design plan.";

                var requestBody = new
                {
                    model = "gpt-4",
                    messages = new[]
                    {
                new { role = "system", content = "You are an expert interior designer summarizing home setup projects." },
                new { role = "user", content = prompt }
            },
                    temperature = 0.7,
                    max_tokens = 300
                };

                var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(_apiUrl, content);
                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync();
                var responseObj = JsonConvert.DeserializeObject<dynamic>(responseString);
                return responseObj.choices[0].message.content.ToString();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating report summary from OpenAI");
                return $"Smart Home Setup Summary for {project.Location} - {project.StylePreference} style with {project.RoomCount} rooms";
            }
        }
    }
}

/*using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SmartHomeSetupPlanner.DTOs;
using SmartHomeSetupPlanner.ExternalServices;
using SmartHomeSetupPlanner.Services;

namespace SmartHomeSetupPlanner.ExternalServices.Implementation
{
    public class OpenAIClient : IAIClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly IProjectService _projectService;
        private readonly IRoomService _roomService;
        
        private readonly string _apiKey;
        private readonly string _apiUrl;

        public OpenAIClient(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            IProjectService projectService,
            IRoomService roomService)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _projectService = projectService;
            _roomService = roomService;
            
            _apiKey = _configuration["OpenAI:ApiKey"];
            _apiUrl = _configuration["OpenAI:ApiUrl"];
        }

        public async Task<AIRecommendationResponseDto> GetRecommendationsAsync(int projectId, int? roomId = null)
        {
            // Get project details
            var projectDetails = await _projectService.GetProjectDetailsAsync(projectId);
            
            // Prepare AI prompt based on project (and optional room) details
            string prompt = GenerateRecommendationPrompt(projectDetails, roomId);
            
            // Make API call to OpenAI
            var response = await MakeOpenAIRequestAsync(prompt);
            
            // Parse and map the AI response to our DTO
            return ParseAIRecommendationResponse(response, projectDetails);
        }

        public async Task<string> GenerateLayoutImageAsync(int projectId, string specialInstructions = null)
        {
            // Get project details including rooms and furniture
            var projectDetails = await _projectService.GetProjectDetailsAsync(projectId);
            
            // Prepare AI prompt for DALL-E
            string prompt = GenerateLayoutImagePrompt(projectDetails, specialInstructions);
            
            // Make API call to DALL-E
            var imageUrl = await MakeDALLERequestAsync(prompt);
            
            return imageUrl;
        }

        public async Task<string> GenerateReportAsync(int projectId, string additionalNotes = null)
        {
            // Get complete project details
            var projectDetails = await _projectService.GetProjectDetailsAsync(projectId);
            
            // Prepare AI prompt for report generation
            string prompt = GenerateReportPrompt(projectDetails, additionalNotes);
            
            // Make API call to OpenAI
            var response = await MakeOpenAIRequestAsync(prompt);
            
            // Format response into a proper report structure
            return FormatReportResponse(response, projectDetails);
        }

        private string GenerateRecommendationPrompt(ProjectDetailDto project, int? roomId)
        {
            StringBuilder prompt = new StringBuilder();
            prompt.AppendLine("Generate furniture and appliance recommendations based on the following details:");
            prompt.AppendLine($"Budget: ${project.Budget}");
            prompt.AppendLine($"Home Size: {project.HomeSize}");
            prompt.AppendLine($"Room Count: {project.RoomCount}");
            prompt.AppendLine($"Location: {project.Location}");
            prompt.AppendLine($"Style Preference: {project.StylePreference}");
            
            if (roomId.HasValue)
            {
                var room = project.Rooms.Find(r => r.RoomId == roomId.Value);
                if (room != null)
                {
                    prompt.AppendLine($"Room Type: {room.RoomType}");
                    prompt.AppendLine($"Room Size: {room.RoomSize} sqm");
                    prompt.AppendLine($"Room Budget: ${room.RoomBudget}");
                }
            }
            
            prompt.AppendLine("Please provide recommendations in JSON format with the following structure:");
            prompt.AppendLine("{");
            prompt.AppendLine("  \"roomRecommendations\": [");
            prompt.AppendLine("    {");
            prompt.AppendLine("      \"roomType\": \"Living Room\",");
            prompt.AppendLine("      \"recommendedBudget\": 2000,");
            prompt.AppendLine("      \"recommendedFurniture\": [");
            prompt.AppendLine("        {");
            prompt.AppendLine("          \"name\": \"Sofa\",");
            prompt.AppendLine("          \"category\": \"Seating\",");
            prompt.AppendLine("          \"estimatedPrice\": 800,");
            prompt.AppendLine("          \"recommendationReason\": \"Matches modern style and provides comfort\",");
            prompt.AppendLine("          \"imageUrl\": \"\"");
            prompt.AppendLine("        }");
            prompt.AppendLine("      ]");
            prompt.AppendLine("    }");
            prompt.AppendLine("  ],");
            prompt.AppendLine("  \"totalBudgetUsed\": 5000,");
            prompt.AppendLine("  \"generalRecommendation\": \"Overall recommendation text\"");
            prompt.AppendLine("}");
            
            return prompt.ToString();
        }

        private string GenerateLayoutImagePrompt(ProjectDetailDto project, string specialInstructions)
        {
            StringBuilder prompt = new StringBuilder();
            prompt.AppendLine($"Create a 2D floor plan layout for a {project.HomeSize} home with {project.RoomCount} rooms in {project.StylePreference} style.");
            
            if (project.Rooms != null && project.Rooms.Count > 0)
            {
                prompt.AppendLine("The home includes the following rooms with furniture:");
                
                foreach (var room in project.Rooms)
                {
                    prompt.AppendLine($"- {room.RoomType} ({room.RoomSize} sqm) containing:");
                    if (room.Furniture != null)
                    {
                        foreach (var furniture in room.Furniture)
                        {
                            prompt.AppendLine($"  * {furniture.Name} ({furniture.Category})");
                        }
                    }
                }
            }
            
            if (!string.IsNullOrEmpty(specialInstructions))
            {
                prompt.AppendLine($"Special instructions: {specialInstructions}");
            }
            
            prompt.AppendLine("Create a clean, top-down 2D floor plan with furniture placement and room labels. Use a clean, modern design with a white background and blue lines for walls.");
            
            return prompt.ToString();
        }

        private string GenerateReportPrompt(ProjectDetailDto project, string additionalNotes)
        {
            StringBuilder prompt = new StringBuilder();
            prompt.AppendLine("Generate a comprehensive home setup report based on the following details:");
            prompt.AppendLine($"Budget: ${project.Budget}");
            prompt.AppendLine($"Home Size: {project.HomeSize}");
            prompt.AppendLine($"Room Count: {project.RoomCount}");
            prompt.AppendLine($"Location: {project.Location}");
            prompt.AppendLine($"Style Preference: {project.StylePreference}");
            
            if (project.Rooms != null && project.Rooms.Count > 0)
            {
                prompt.AppendLine("The home includes the following rooms with furniture:");
                
                foreach (var room in project.Rooms)
                {
                    prompt.AppendLine($"- {room.RoomType} ({room.RoomSize} sqm, Budget: ${room.RoomBudget}) containing:");
                    if (room.Furniture != null)
                    {
                        foreach (var furniture in room.Furniture)
                        {
                            prompt.AppendLine($"  * {furniture.Name} ({furniture.Category}, ${furniture.Price})");
                            if (furniture.PriceComparisons != null && furniture.PriceComparisons.Count > 0)
                            {
                                prompt.AppendLine("    Price comparisons:");
                                foreach (var comparison in furniture.PriceComparisons)
                                {
                                    prompt.AppendLine($"    - {comparison.StoreName}: ${comparison.Price}");
                                }
                            }
                        }
                    }
                }
            }
            
            if (!string.IsNullOrEmpty(additionalNotes))
            {
                prompt.AppendLine($"Additional notes: {additionalNotes}");
            }
            
            prompt.AppendLine("Generate a detailed report with the following sections:");
            prompt.AppendLine("1. Executive Summary");
            prompt.AppendLine("2. Budget Breakdown and Analysis");
            prompt.AppendLine("3. Room-by-Room Overview with Furniture Recommendations");
            prompt.AppendLine("4. Money-Saving Opportunities");
            prompt.AppendLine("5. Style Consistency Tips");
            prompt.AppendLine("6. Recommended Future Purchases");
            prompt.AppendLine("7. Conclusion");
            
            return prompt.ToString();
        }

        private async Task<string> MakeOpenAIRequestAsync(string prompt)
        {
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
            
            var requestBody = new
            {
                model = "gpt-4-turbo",
                messages = new[]
                {
                    new { role = "system", content = "You are an interior design and home planning AI assistant that provides detailed, specific recommendations based on budget, style, and room requirements. Format your responses in the requested structure." },
                    new { role = "user", content = prompt }
                },
                temperature = 0.7
            };
            
            var requestContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");
            
            var response = await httpClient.PostAsync(_apiUrl, requestContent);
            response.EnsureSuccessStatusCode();
            
            var responseString = await response.Content.ReadAsStringAsync();
            var responseObject = JsonSerializer.Deserialize<JsonElement>(responseString);
            
            return responseObject.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
        }

        private async Task<string> MakeDALLERequestAsync(string prompt)
        {
            var httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
            
            var requestBody = new
            {
                model = "dall-e-3",
                prompt = prompt,
                n = 1,
                size = "1024x1024"
            };
            
            var requestContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");
            
            var dalleUrl = _configuration["OpenAI:DalleUrl"];
            var response = await httpClient.PostAsync(dalleUrl, requestContent);
            response.EnsureSuccessStatusCode();
            
            var responseString = await response.Content.ReadAsStringAsync();
            var responseObject = JsonSerializer.Deserialize<JsonElement>(responseString);
            
            return responseObject.GetProperty("data")[0].GetProperty("url").GetString();
        }

        private AIRecommendationResponseDto ParseAIRecommendationResponse(string response, ProjectDetailDto projectDetails)
        {
            try
            {
                // Parse the JSON response from OpenAI
                var responseObject = JsonSerializer.Deserialize<JsonElement>(response);
                
                var result = new AIRecommendationResponseDto
                {
                    RoomRecommendations = new List<RoomRecommendationDto>(),
                    TotalBudgetUsed = responseObject.GetProperty("totalBudgetUsed").GetDecimal(),
                    GeneralRecommendation = responseObject.GetProperty("generalRecommendation").GetString()
                };
                
                var recommendations = responseObject.GetProperty("roomRecommendations");
                foreach (var roomRec in recommendations.EnumerateArray())
                {
                    var roomRecommendation = new RoomRecommendationDto
                    {
                        RoomType = roomRec.GetProperty("roomType").GetString(),
                        RecommendedBudget = roomRec.GetProperty("recommendedBudget").GetDecimal(),
                        RecommendedFurniture = new List<FurnitureRecommendationDto>()
                    };
                    
                    var furniture = roomRec.GetProperty("recommendedFurniture");
                    foreach (var item in furniture.EnumerateArray())
                    {
                        roomRecommendation.RecommendedFurniture.Add(new FurnitureRecommendationDto
                        {
                            Name = item.GetProperty("name").GetString(),
                            Category = item.GetProperty("category").GetString(),
                            EstimatedPrice = item.GetProperty("estimatedPrice").GetDecimal(),
                            RecommendationReason = item.GetProperty("recommendationReason").GetString(),
                            ImageUrl = item.GetProperty("imageUrl").GetString()
                        });
                    }
                    
                    result.RoomRecommendations.Add(roomRecommendation);
                }
                
                return result;
            }
            catch (Exception ex)
            {
                // Log the error and return a fallback response
                Console.WriteLine($"Error parsing AI response: {ex.Message}");
                return new AIRecommendationResponseDto
                {
                    RoomRecommendations = new List<RoomRecommendationDto>(),
                    TotalBudgetUsed = 0,
                    GeneralRecommendation = "Unable to parse AI recommendations. Please try again."
                };
            }
        }

        private string FormatReportResponse(string response, ProjectDetailDto projectDetails)
        {
            // Simply return the response as it should already be formatted correctly
            // In a real implementation, we might want to further process this to improve formatting
            return response;
        }
    }
}*/