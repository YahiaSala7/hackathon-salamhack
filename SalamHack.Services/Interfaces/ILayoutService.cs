using SalamHack.Data.DTOS.Layout;

namespace SalamHack.Services.Interfaces
{

    public interface ILayoutService
    {
        Task<LayoutDto> GetLayoutByIdAsync(int layoutId);
        Task<List<LayoutSummaryDto>> GetProjectLayoutsAsync(int projectId);
        Task<LayoutDto> CreateLayoutAsync(LayoutCreateDto layoutCreateDto);
        Task<LayoutDto> SetLayoutAsFinalAsync(int layoutId);
        // Task<LayoutDto> GenerateLayoutAsync(LayoutGenerationRequestDto generationRequestDto);
        Task<bool> DeleteLayoutAsync(int layoutId);
    }
}
