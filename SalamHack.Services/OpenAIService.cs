using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SalamHack.Data;
using SalamHack.Data.DTOS.Recommendation;
using SalamHack.Models;
using SalamHack.Services.infterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalamHack.Services
{
    public class OpenAIService : IOpenAIService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<OpenAIService> _logger;
        private readonly string _apiKey;
        private readonly string _apiUrl;

       // public OpenAIService(HttpClient httpClient, IConfiguration configuration, ILogger<OpenAIService> logger)
       // {
       //     _httpClient = httpClient;
       //     _configuration = configuration;
       //     _logger = logger;
       //     _apiKey = _configuration["OpenAI:ApiKey"];
       //     _apiUrl = _configuration["OpenAI:ApiUrl"];

       //     _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
       // }

       // public async Task<AIRecommendationResponseDto> GetFurnitureRecommendations(Project project, List<Room> rooms = null)
       // {
       //     //    try
       //     //    {
       //     //        var prompt = BuildRecommendationPrompt(project, rooms);

       //     //        var requestBody = new
       //     //        {
       //     //            model = "gpt-4",
       //     //            messages = new[]
       //     //            {
       //     //                new { role = "system", content = "You are an interior design expert helping users design their home by recommending furniture and appliances based on their budget and preferences." },
       //     //                new { role = "user", content = prompt }
       //     //            },
       //     //            temperature = 0.7,
       //     //            max_tokens = 1500
       //     //        };

       //     //        var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
       //     //        var response = await _httpClient.PostAsync(_apiUrl, content);
       //     //        response.EnsureSuccessStatusCode();

       //     //        var responseString = await response.Content.ReadAsStringAsync();
       //     //        var responseObj = JsonConvert.DeserializeObject<dynamic>(responseString);
       //     //        var aiResponse = responseObj.choices[0].message.content.ToString();

       //     //        // Parse AI response into recommendation object
       //     //        return ParseAIRecommendationResponse(aiResponse, project.Budget);
       //     //    }
       //     //    catch (Exception ex)
       //     //    {
       //     //        _logger.LogError(ex, "Error getting furniture recommendations from OpenAI");
       //     //        throw;
       //     //    }
       // }

       // public async Task<string> GenerateRoomDescription(Room room)
       // {
       //     //try
       //     //{
       //     //    var prompt = $"Describe the ideal layout and styling for a {room.RoomType} with an area of {room.RoomSize} square meters and a budget of {room.RoomBudget:C}. " +
       //     //        $"Consider the overall home style preference of the project which is {room.Project.StylePreference}.";

       //     //    var requestBody = new
       //     //    {
       //     //        model = "gpt-4",
       //     //        messages = new[]
       //     //        {
       //     //            new { role = "system", content = "You are an interior design expert providing detailed descriptions of room setups." },
       //     //            new { role = "user", content = prompt }
       //     //        },
       //     //        temperature = 0.7,
       //     //        max_tokens = 500
       //     //    };

       //     //    var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
       //     //    var response = await _httpClient.PostAsync(_apiUrl, content);
       //     //    response.EnsureSuccessStatusCode();

       //     //    var responseString = await response.Content.ReadAsStringAsync();
       //     //    var responseObj = JsonConvert.DeserializeObject<dynamic>(responseString);
       //     //    return responseObj.choices[0].message.content.ToString();
       //     //}
       //     //catch (Exception ex)
       //     //{
       //     //    _logger.LogError(ex, "Error generating room description from OpenAI");
       //     //    throw;
       //     //}
       // }

       //public async Task<string> GenerateReportSummary(Project project) { 
       // }

    }
}