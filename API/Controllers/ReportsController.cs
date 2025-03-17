using Microsoft.AspNetCore.Mvc;
using SalamHack.Models;
using SalamHack.Services.Interfaces;

namespace SalamHack.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        // GET: api/reports/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Report>> GetReport(int id)
        {
            var report = await _reportService.GetReportByIdAsync(id);

            if (report == null)
            {
                return NotFound();
            }

            return Ok(report);
        }

        // GET: api/reports/project/{projectId}
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<List<Report>>> GetProjectReports(int projectId)
        {
            var reports = await _reportService.GetReportsByProjectIdAsync(projectId);
            return Ok(reports);
        }

        // GET: api/reports/latest/{projectId}
        [HttpGet("latest/{projectId}")]
        public async Task<ActionResult<Report>> GetLatestReport(int projectId)
        {
            var report = await _reportService.GetLatestReportAsync(projectId);

            if (report == null)
            {
                return NotFound();
            }

            return Ok(report);
        }

        // POST: api/reports/generate/{projectId}
        [HttpPost("generate/{projectId}")]
        public async Task<ActionResult<Report>> GenerateReport(int projectId, [FromBody] GenerateReportRequest request)
        {
            try
            {
                var report = await _reportService.GenerateReportAsync(projectId, request?.AdditionalNotes);

                return CreatedAtAction(
                    nameof(GetReport),
                    new { id = report.ReportId },
                    report
                );
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while generating the report: {ex.Message}");
            }
        }

        // PUT: api/reports/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReport(int id, [FromBody] Report report)
        {
            if (id != report.ReportId)
            {
                return BadRequest("Report ID mismatch");
            }

            try
            {
                var updatedReport = await _reportService.UpdateReportAsync(report);
                return Ok(updatedReport);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating the report: {ex.Message}");
            }
        }

        // DELETE: api/reports/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            var result = await _reportService.DeleteReportAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }

    // Request model for the generate report endpoint
    public class GenerateReportRequest
    {
        public string AdditionalNotes { get; set; }
    }
}