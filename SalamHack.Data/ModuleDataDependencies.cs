using Microsoft.Extensions.DependencyInjection;
using SalamHack.Data.Repositories;
using SalamHack.Data.Repositories.Interfaces;


namespace SalamHack.Data
{
    public static class ModuleDataDependencies
    {
        public static IServiceCollection AddDataDependencies(this IServiceCollection services)
        {

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IProjectRepository, ProjectRepository>();
            services.AddScoped<IRoomRepository, RoomRepository>();
            services.AddScoped<IFurnitureRepository, FurnitureRepository>();
            services.AddScoped<IPriceComparisonRepository, PriceComparisonRepository>();
            services.AddScoped<ILayoutRepository, LayoutRepository>();
            services.AddScoped<IReportRepository, ReportRepository>();

            return services;
        }
    }
}
