
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using SalamHack.Services.Interfaces;
using SalamHack.Services.Services;

namespace SalamHack.Services
{
    public static class ModuleServiceDependencies
    {
        public static IServiceCollection AddServiceDependencies(this IServiceCollection services, IConfiguration configuration)
        {

            // تسجيل الإعدادات
            services.Configure<GeocodingSettings>(configuration.GetSection("Geocoding"));
            services.Configure<PriceApiSettings>(configuration.GetSection("PriceApi"));

            // تسجيل عملاء HTTP مع IHttpClientFactory
            services.AddHttpClient("GoogleMapsClient", client =>
            {
                // الإعدادات الأساسية لعميل Google Maps API
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                // لا حاجة لتعيين BaseUrl هنا لأنه مضمن في الخدمة
            });

            services.AddHttpClient("PriceApiClient", (serviceProvider, client) =>
            {
                var settings = serviceProvider.GetRequiredService<IOptions<PriceApiSettings>>().Value;
                client.BaseAddress = new Uri(settings.BaseUrl);
                client.DefaultRequestHeaders.Add("ApiKey", settings.ApiKey);
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            });

            // تسجيل الخدمات
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IRoomService, RoomService>();
            services.AddScoped<IFurnitureService, FurnitureService>();
            services.AddScoped<ILayoutService, LayoutService>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IAIRecommendationService, AIRecommendationService>();

            // تسجيل الخدمات الخارجية
            services.AddScoped<IAIClient, GeminiClient>();
            services.AddScoped<IPriceSearchService, EnhancedPriceService>();
            services.AddScoped<IPriceComparisonService, EnhancedPriceService>();
            services.AddScoped<IGeocodingService, GeocodingService>();

            return services;
        }
    }


}
