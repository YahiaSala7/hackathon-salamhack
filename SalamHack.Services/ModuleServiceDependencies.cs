
using Microsoft.Extensions.DependencyInjection;
using SalamHack.Services.Interfaces;
using SalamHack.Services.Services;

namespace SalamHack.Services
{
    public static class ModuleServiceDependencies
    {
        public static IServiceCollection AddServiceDependencies(this IServiceCollection services)
        {
            //services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IRoomService, RoomService>();
            services.AddScoped<IFurnitureService, FurnitureService>();
            services.AddScoped<ILayoutService, LayoutService>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IAIRecommendationService, AIRecommendationService>();


            // Register external builder.Services

            services.AddSingleton<IAIClient, OpenAIClient>();
            services.AddScoped<IPriceSearchService, EnhancedPriceService>();
            services.AddScoped<IPriceComparisonService, EnhancedPriceService>();
            services.AddScoped<IGeocodingService, GeocodingService>();
            return services;

        }

    }
}
