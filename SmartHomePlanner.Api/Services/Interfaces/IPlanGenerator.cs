using SmartHomePlanner.Api.DTOS;

namespace SmartHomePlanner.Api.Services.Interfaces
{
    // Interfaces/IPlanGenerator.cs
    public interface IPlanGenerator
    {
        Task<HomeSetupResponseDto> GeneratePlanAsync(PlanRequestDto request);
        Task<object> GenerateImageAsync(string prompt);
    }
}
