using AutoMapper;
using SalamHack.Data.DTOS.Furniture;
using SalamHack.Data.DTOS.Layout;
using SalamHack.Data.DTOS.PriceComparison;
using SalamHack.Data.DTOS.Project;
using SalamHack.Data.DTOS.Recommendation;
using SalamHack.Data.DTOS.Report;
using SalamHack.Data.DTOS.Room;
using SalamHack.Data.DTOS.Store;
using SalamHack.Models;

namespace SalamHack.Data.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Furniture
            CreateMap<Furniture, FurnitureDto>();
            CreateMap<FurnitureDto, Furniture>().ForMember(dest => dest.Room, opt => opt.Ignore());
            CreateMap<FurnitureCreateDto, Furniture>().ForMember(dest => dest.FurnitureId, opt => opt.Ignore());
            CreateMap<Furniture, FurnitureAvailabilityDto>().ForMember(dest => dest.ProductUrl, opt => opt.MapFrom(src => src.StoreLink));

            // Layout
            CreateMap<Layout, LayoutDto>();
            CreateMap<LayoutCreateDto, Layout>().ForMember(dest => dest.LayoutId, opt => opt.Ignore());
            CreateMap<Layout, LayoutSummaryDto>();

            // PriceComparison
            CreateMap<PriceComparison, PriceComparisonDto>()
                 .ForMember(dest => dest.MapUrl, opt => opt.MapFrom(src => src.Url))
                    .ReverseMap();
            CreateMap<PriceComparisonCreateDto, PriceComparison>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.Now))
                .ForMember(dest => dest.ComparisonId, opt => opt.Ignore());

            // External DTOs -> Entity
            CreateMap<NearbyStoreDto, PriceComparison>()
                .ForMember(dest => dest.StoreName, opt => opt.MapFrom(src => $"{src.StoreName} ({src.DistanceKm:F1}km away)"))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.Url, opt => opt.MapFrom(src => src.MapUrl))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.Now));

            // fix this mapping again
            CreateMap<PriceComparison, FurnitureAvailabilityDto>()
                 .ForMember(dest => dest.FurnitureName, opt => opt.MapFrom(src => src.Furniture.Name))
                .ForMember(dest => dest.ProductUrl, opt => opt.MapFrom(src => src.Url))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Furniture.Category))
                .ForMember(dest => dest.FurnitureId, opt => opt.MapFrom(src => src.Furniture.FurnitureId))
                .ForMember(dest => dest.RoomId, opt => opt.MapFrom(src => src.Furniture.RoomId))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Furniture.Name))
                .ForMember(dest => dest.StoreLink, opt => opt.MapFrom(src => src.Furniture.StoreLink))
                // If you need to map additional properties (Distance, StoreAddress, StoreName, etc.), you can configure them here:
                .ForMember(dest => dest.Distance, opt => opt.Ignore())  // or map from a source if available
                .ForMember(dest => dest.MapUrl, opt => opt.Ignore())
                .ForMember(dest => dest.StoreAddress, opt => opt.Ignore())
                .ForMember(dest => dest.StoreName, opt => opt.Ignore());
            // Project
            CreateMap<Project, ProjectDto>();
            CreateMap<ProjectCreateDto, Project>().ForMember(dest => dest.ProjectId, opt => opt.Ignore());
            CreateMap<Project, ProjectDetailDto>()
                .ForMember(dest => dest.Rooms, opt => opt.MapFrom(src => src.Rooms))
                .ForMember(dest => dest.Layouts, opt => opt.MapFrom(src => src.Layouts))
                .ForMember(dest => dest.CurrentLayout, opt => opt.MapFrom(src => src.Layouts.FirstOrDefault(l => l.IsFinal)))
                .ForMember(dest => dest.LatestReport, opt => opt.MapFrom(src => src.Reports.OrderByDescending(r => r.CreatedAt).FirstOrDefault()));
            CreateMap<Report, ReportDto>();
            CreateMap<ReportCreateDto, Report>()
                .ForMember(dest => dest.ReportId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Project, opt => opt.Ignore());

            CreateMap<Report, ReportSummaryDto>();

            // ===== Room Mappings =====
            CreateMap<Room, RoomDto>()
                .ForMember(dest => dest.Furniture, opt => opt.MapFrom(src => src.Furniture));

            CreateMap<RoomCreateDto, Room>()
                .ForMember(dest => dest.RoomId, opt => opt.Ignore())
                .ForMember(dest => dest.Project, opt => opt.Ignore())
                .ForMember(dest => dest.Furniture, opt => opt.Ignore());

            // For recommendations (if mapping from existing data)
            CreateMap<Room, RoomRecommendationDto>()
                .ForMember(dest => dest.RecommendedBudget, opt => opt.MapFrom(src => src.RoomBudget))
                .ForMember(dest => dest.RecommendedFurniture, opt => opt.MapFrom(src => src.Furniture));
            // ===================== AI Recommendation Mappings =====================
            // For AI response composition (typically requires custom logic)
            CreateMap<Project, AIRecommendationResponseDto>()
                .ForMember(dest => dest.RoomBudgetRecommendations,
                    opt => opt.MapFrom(src => src.Rooms))
                .ForMember(dest => dest.FurnitureRecommendations,
                    opt => opt.MapFrom(src => src.Rooms.SelectMany(r => r.Furniture)))
                .ForMember(dest => dest.TotalBudgetUsed,
                    opt => opt.MapFrom(src => src.Rooms.Sum(r => r.Furniture.Sum(f => f.Price))))
                .AfterMap((src, dest) =>
                {
                    dest.GeneralRecommendation = dest.TotalBudgetUsed > src.Budget
                        ? "Consider reducing furniture costs"
                        : "Budget allocation looks good";
                });

            // Room budget recommendations
            CreateMap<Room, RoomBudgetRecommendationDto>()
                .ForMember(dest => dest.RecommendedBudget,
                    opt => opt.MapFrom(src => src.RoomBudget))
                .ForMember(dest => dest.RecommendationReason,
                    opt => opt.MapFrom(src => $"Recommended based on {src.RoomSize}m² size"));

            /*   // Furniture recommendations
               CreateMap<Furniture, FurnitureRecommendationDto>()
                   .ForMember(dest => dest.EstimatedPrice,
                       opt => opt.MapFrom(src => src.Price))
                   .ForMember(dest => dest.PreferredStore,
                       opt => opt.MapFrom(src => src.StoreLink != null
                           ? new Uri(src.StoreLink).Host
                           : "Unknown"))
                   .ForMember(dest => dest.IsApproved,
                       opt => opt.Ignore());  // Default to false

               // ===================== Store Mappings =====================
               // If you have a Store entity
               CreateMap<Store, NearbyStoreDto>()
                   .ForMember(dest => dest.StoreName,
                       opt => opt.MapFrom(src => src.Name))
                   .ForMember(dest => dest.MapUrl,
                       opt => opt.MapFrom(src => src.MapLink))
                   .ForMember(dest => dest.AvailableFurniture,
                       opt => opt.MapFrom(src => src.FurnitureItems));

               // If mapping from external API model
               CreateMap<ExternalStoreApiResponse, NearbyStoreDto>()
                   .ForMember(dest => dest.DistanceKm,
                       opt => opt.MapFrom(src => src.Distance / 1000))
                   .ForMember(dest => dest.AvailableFurniture,
                       opt => opt.MapFrom(src => src.Products));*/

        }
    }
}


