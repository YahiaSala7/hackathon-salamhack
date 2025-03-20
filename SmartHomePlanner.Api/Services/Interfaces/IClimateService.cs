namespace SmartHomePlanner.Api.Services.Interfaces
{

    public interface IClimateService
    {
        Task<string> GetClimateDescriptionAsync(string location);
    }
}
