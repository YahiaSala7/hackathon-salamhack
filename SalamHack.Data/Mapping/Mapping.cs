using AutoMapper;
using SalamHack.Data.DTOS.Furniture;
using SalamHack.Data.DTOS.Layout;
using SalamHack.Data.DTOS.PriceComparison;
using SalamHack.Data.DTOS.Project;
using SalamHack.Data.DTOS.Recommendation;
using SalamHack.Data.DTOS.Report;
using SalamHack.Data.DTOS.Room;
using SalamHack.Models;

namespace SalamHack.Data.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            /*  // User Mappings
              CreateMap<User, UserDto>();
              CreateMap<UserCreateDto, User>()
                  .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()); // سيتم معالجة الهاش بشكل منفصل*/

            // Project Mappings
            CreateMap<Project, ProjectDto>();
            CreateMap<ProjectCreateDto, Project>();
            CreateMap<Project, ProjectDetailDto>()
                //.ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.Rooms, opt => opt.MapFrom(src => src.Rooms))
                .ForMember(dest => dest.Layouts, opt => opt.MapFrom(src => src.Layouts))
                .ForMember(dest => dest.CurrentLayout, opt => opt.MapFrom(src => src.Layouts.FirstOrDefault(l => l.IsFinal)))
                .ForMember(dest => dest.LatestReport, opt => opt.MapFrom(src => src.Reports.OrderByDescending(r => r.CreatedAt).FirstOrDefault()));

            // Room Mappings
            CreateMap<Room, RoomDto>();
            CreateMap<RoomCreateDto, Room>();

            // Furniture Mappings
            CreateMap<Furniture, FurnitureDto>();
            CreateMap<FurnitureCreateDto, Furniture>();
            CreateMap<FurnitureRecommendationDto, Furniture>()
                .ForMember(dest => dest.FurnitureId, opt => opt.Ignore());

            // PriceComparison Mappings
            CreateMap<PriceComparison, PriceComparisonDto>();
            CreateMap<PriceComparisonCreateDto, PriceComparison>();

            // Layout Mappings
            CreateMap<Layout, LayoutDto>();
            CreateMap<LayoutCreateDto, Layout>();
            CreateMap<Layout, LayoutSummaryDto>();

            // Report Mappings
            CreateMap<Report, ReportDto>();
            CreateMap<ReportCreateDto, Report>();
            CreateMap<Report, ReportSummaryDto>();

            // AI Recommendation Mappings (خاصة بالخدمات)
            CreateMap<AIRecommendationResponseDto, Project>()
                .ForMember(dest => dest.Rooms, opt => opt.Ignore()); // سيتم معالجة التوصيات بشكل منفصل
        }
    }
}
