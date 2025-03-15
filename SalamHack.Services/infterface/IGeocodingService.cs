using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalamHack.Services.infterface
{
    public interface IGeocodingService
    {
        Task<(double latitude, double longitude)> GetCoordinatesAsync(string address);
        Task<string> GetAddressAsync(double latitude, double longitude);
        Task<double> CalculateDistanceAsync(string address1, string address2);
    }
}
