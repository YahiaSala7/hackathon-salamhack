using Microsoft.Extensions.DependencyInjection;
using SalamHack.Data.Repositories;
using SalamHack.Data.Repositories.Interfaces;


namespace SalamHack.Data
{
    public static class ModuleDataDependencies
    {
        public static IServiceCollection AddDataDependencies(this IServiceCollection services)
        {

            Services.AddScoped<IUserRepository, UserRepository>();
            Services.AddScoped<IProjectRepository, ProjectRepository>();
            Services.AddScoped<IRoomRepository, RoomRepository>();
            Services.AddScoped<IFurnitureRepository, FurnitureRepository>();
            Services.AddScoped<IPriceComparisonRepository, PriceComparisonRepository>();
            Services.AddScoped<ILayoutRepository, LayoutRepository>();
            Services.AddScoped<IReportRepository, ReportRepository>();
            return services;
        }
    }
}
