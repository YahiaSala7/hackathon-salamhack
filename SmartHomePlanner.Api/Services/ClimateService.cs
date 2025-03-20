//using SmartHomePlanner.Api.Services.Interfaces;

//namespace SmartHomePlanner.Api.Services
//{
//    // Services/ClimateService.cs
//    public class ClimateService : IClimateService
//    {
//        private readonly IConfiguration _config;
//        private readonly HttpClient _client;

//        public ClimateService(IConfiguration config, HttpClient client)
//        {
//            _config = config;
//            _client = client;
//        }

//        public async Task<string> GetClimateDescriptionAsync(string location)
//        {
//            var apiKey = _config["OpenWeather:ApiKey"];
//            var response = await _client.GetFromJsonAsync<OpenWeatherResponse>(
//                $"https://api.openweathermap.org/data/2.5/weather?q={location}&appid={apiKey}&lang=ar&units=metric");

//            return response.Weather[0].Description;
//        }
//    }

//    public class OpenWeatherResponse
//    {
//        public Weather[] Weather { get; set; }
//    }

//    public class Weather
//    {
//        public string Description { get; set; }
//    }
//}
