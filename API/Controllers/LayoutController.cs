using Microsoft.AspNetCore.Mvc;
using SalamHack.Data.DTOS.Layout;
using SalamHack.Services.Interfaces;

namespace SalamHack.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LayoutController : ControllerBase
    {
        private readonly ILayoutService _layoutService;

        public LayoutController(ILayoutService layoutService)
        {
            _layoutService = layoutService;
        }

        // GET: api/layout/{id}
        [HttpGet("{layoutId}")]
        public async Task<ActionResult<LayoutDto>> GetLayout(int layoutId)
        {
            var layout = await _layoutService.GetLayoutByIdAsync(layoutId);

            if (layout == null)
            {
                return NotFound();
            }

            return Ok(layout);
        }

        // GET: api/layout/project/{projectId}
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<List<LayoutSummaryDto>>> GetProjectLayouts(int projectId)
        {
            var layouts = await _layoutService.GetProjectLayoutsAsync(projectId);
            return Ok(layouts);
        }

        // POST: api/layout
        [HttpPost]
        public async Task<ActionResult<LayoutDto>> CreateLayout([FromBody] LayoutCreateDto layoutCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdLayout = await _layoutService.CreateLayoutAsync(layoutCreateDto);
            return CreatedAtAction(nameof(GetLayout), new { layoutId = createdLayout.LayoutId }, createdLayout);
        }

        // PUT: api/layout/{id}/setAsFinal
        [HttpPut("{layoutId}/setAsFinal")]
        public async Task<ActionResult<LayoutDto>> SetLayoutAsFinal(int layoutId)
        {
            try
            {
                var finalLayout = await _layoutService.SetLayoutAsFinalAsync(layoutId);
                return Ok(finalLayout);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /*
        // POST: api/layout/generate
        [HttpPost("generate")]
        public async Task<ActionResult<LayoutDto>> GenerateLayout([FromBody] LayoutGenerationRequestDto generationRequestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var generatedLayout = await _layoutService.GenerateLayoutAsync(generationRequestDto);
                return CreatedAtAction(nameof(GetLayout), new { layoutId = generatedLayout.LayoutId }, generatedLayout);
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        */

        // DELETE: api/layout/{id}
        [HttpDelete("{layoutId}")]
        public async Task<ActionResult> DeleteLayout(int layoutId)
        {
            var result = await _layoutService.DeleteLayoutAsync(layoutId);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}