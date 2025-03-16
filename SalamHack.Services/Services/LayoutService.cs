using AutoMapper;
using SalamHack.Data.DTOS.Layout;
using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;
using SalamHack.Services.Interfaces;

namespace SalamHack.Services.Services
{
    public class LayoutService : ILayoutService
    {
        private readonly ILayoutRepository _layoutRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly IAIClient _aiClient;
        private readonly IMapper _mapper;

        public LayoutService(
            ILayoutRepository layoutRepository,
            IProjectRepository projectRepository,
            IAIClient aiClient,
            IMapper mapper)
        {
            _layoutRepository = layoutRepository;
            _projectRepository = projectRepository;
            _aiClient = aiClient;
            _mapper = mapper;
        }

        public async Task<LayoutDto> GetLayoutByIdAsync(int layoutId)
        {
            var layout = await _layoutRepository.GetByIdAsync(layoutId);
            return _mapper.Map<LayoutDto>(layout);
        }

        public async Task<List<LayoutSummaryDto>> GetProjectLayoutsAsync(int projectId)
        {
            var layouts = await _layoutRepository.GetByProjectIdAsync(projectId);
            return _mapper.Map<List<LayoutSummaryDto>>(layouts);
        }

        public async Task<LayoutDto> CreateLayoutAsync(LayoutCreateDto layoutCreateDto)
        {
            // تحويل الـ DTO إلى كيان باستخدام AutoMapper
            var layoutEntity = _mapper.Map<Layout>(layoutCreateDto);
            var createdLayout = await _layoutRepository.CreateAsync(layoutEntity);
            return _mapper.Map<LayoutDto>(createdLayout);
        }

        public async Task<LayoutDto> SetLayoutAsFinalAsync(int layoutId)
        {
            var layout = await _layoutRepository.GetByIdAsync(layoutId);
            if (layout == null)
                throw new ArgumentException("Layout not found");

            // الحصول على كل التصاميم الخاصة بالمشروع
            var projectLayouts = await _layoutRepository.GetByProjectIdAsync(layout.ProjectId);

            // إعادة تعيين جميع التصاميم كغير نهائية
            foreach (var projectLayout in projectLayouts)
            {
                if (projectLayout.IsFinal)
                {
                    projectLayout.IsFinal = false;
                    await _layoutRepository.UpdateAsync(projectLayout);
                }
            }

            // تعيين التصميم المحدد كنهائي
            layout.IsFinal = true;
            var updatedLayout = await _layoutRepository.UpdateAsync(layout);
            return _mapper.Map<LayoutDto>(updatedLayout);
        }

        public async Task<LayoutDto> GenerateLayoutAsync(LayoutGenerationRequestDto generationRequestDto)
        {
            // الحصول على تفاصيل المشروع بما في ذلك الغرف والأثاث
            var project = await _projectRepository.GetProjectWithDetailsAsync(generationRequestDto.ProjectId);
            if (project == null)
                throw new ArgumentException("Project not found");

            // استخدام خدمة الذكاء الاصطناعي لتوليد صورة التصميم بناءً على تفاصيل المشروع
            string layoutImageData = await _aiClient.GenerateLayoutImageAsync(generationRequestDto.ProjectId, generationRequestDto.SpecialInstructions);

            // إنشاء وحفظ التصميم الجديد
            var layoutEntity = new Layout
            {
                ProjectId = generationRequestDto.ProjectId,
                LayoutImage = layoutImageData,
                IsFinal = false,
                //  CreatedDate = DateTime.UtcNow
            };

            var createdLayout = await _layoutRepository.CreateAsync(layoutEntity);
            return _mapper.Map<LayoutDto>(createdLayout);
        }

        public async Task<bool> DeleteLayoutAsync(int layoutId)
        {
            return await _layoutRepository.DeleteAsync(layoutId);
        }
    }
}
