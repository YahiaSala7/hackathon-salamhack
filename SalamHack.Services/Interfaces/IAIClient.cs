using SalamHack.Data.DTOS.Recommendation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalamHack.Services.interfaces
{

    public interface IAIClient
    {
        Task<AIRecommendationResponseDto> GetRecommendationsAsync(int projectId, int? roomId = null);
        Task<string> GenerateLayoutImageAsync(int projectId, string specialInstructions = null);
        Task<string> GenerateReportAsync(int projectId, string additionalNotes = null);
    }
}
