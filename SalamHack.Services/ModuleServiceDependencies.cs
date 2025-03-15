
using Microsoft.Extensions.DependencyInjection;
using SalamHack.Services.Services;

namespace StockWise.Core
{
    public static class ModuleServiceDependencies
    {
        public static IServiceCollection AddServiceDependencies(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IRoomService, RoomService>();
            services.AddScoped<IFurnitureService, FurnitureService>();
            services.AddScoped<IPriceComparisonService, PriceComparisonService>();
            services.AddScoped<ILayoutService, LayoutService>();
            services.AddScoped<IReportService, ReportService>();
            services.AddScoped<IAIRecommendationService, AIRecommendationService>();
            services.AddScoped<IPriceSearchService, PriceSearchService>();

            return services;

        }

    }
}
