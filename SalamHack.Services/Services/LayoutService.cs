namespace SalamHack.Services.Services
{
    public class LayoutService : ILayoutService
    {
        private readonly ILayoutRepository _layoutRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly IAIClient _aiClient;

        public LayoutService(
            ILayoutRepository layoutRepository,
            IProjectRepository projectRepository,
            IAIClient aiClient)
        {
            _layoutRepository = layoutRepository;
            _projectRepository = projectRepository;
            _aiClient = aiClient;
        }

        public async Task<Layout> GetLayoutByIdAsync(int layoutId)
        {
            return await _layoutRepository.GetByIdAsync(layoutId);
        }

        public async Task<List<Layout>> GetLayoutsByProjectIdAsync(int projectId)
        {
            return await _layoutRepository.GetByProjectIdAsync(projectId);
        }

        public async Task<Layout> GetCurrentLayoutAsync(int projectId)
        {
            return await _layoutRepository.GetCurrentLayoutAsync(projectId);
        }

        public async Task<Layout> GenerateLayoutAsync(int projectId, string specialInstructions = null)
        {
            // Get project details including rooms and furniture
            var project = await _projectRepository.GetProjectWithDetailsAsync(projectId);
            if (project == null)
                throw new ArgumentException("Project not found");

            // Use AI service to generate a layout image based on the project details
            string layoutImageData = await _aiClient.GenerateLayoutImageAsync(projectId, specialInstructions);

            // Create and save the new layout
            var layout = new Layout
            {
                ProjectId = projectId,
                LayoutImage = layoutImageData,
                IsFinal = false
            };

            return await _layoutRepository.CreateAsync(layout);
        }

        public async Task<Layout> SetLayoutAsFinalAsync(int layoutId)
        {
            var layout = await _layoutRepository.GetByIdAsync(layoutId);
            if (layout == null)
                throw new ArgumentException("Layout not found");

            // Get all layouts for this project
            var projectLayouts = await _layoutRepository.GetByProjectIdAsync(layout.ProjectId);

            // Set all layouts as not final
            foreach (var projectLayout in projectLayouts)
            {
                if (projectLayout.IsFinal)
                {
                    projectLayout.IsFinal = false;
                    await _layoutRepository.UpdateAsync(projectLayout);
                }
            }
        }
        public async Task<bool> DeleteLayoutAsync(int layoutId)
        {
            return await _layoutRepository.DeleteAsync(layoutId);
        }
    }
}
