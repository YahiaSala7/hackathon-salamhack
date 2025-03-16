namespace SalamHack.Services.Interfaces
{
    public interface IGeocodingService
    {
        Task<(double latitude, double longitude)> GetCoordinatesAsync(string address);
        Task<string> GetAddressAsync(double latitude, double longitude);
        Task<double> CalculateDistanceAsync(string address1, string address2);
    }
}
