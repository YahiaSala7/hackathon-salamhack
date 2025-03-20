// Controllers/PlanController.cs
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using SmartHomePlanner.Api.DTOS;
using SmartHomePlanner.Api.Services.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class PlanController : ControllerBase
{
    private readonly IPlanGenerator _planGenerator;

    public PlanController(IPlanGenerator planGenerator)
    {
        _planGenerator = planGenerator;
    }

    [HttpPost("generate-plan")]
    public async Task<IActionResult> GeneratePlan([FromBody] PlanRequestDto request)
    {
        try
        {
            var response = await _planGenerator.GeneratePlanAsync(request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpPost("generate-image")]
    public async Task<IActionResult> GenerateImage([FromBody] ImageGenerationDto request)
    {
        try
        {
            var response = await _planGenerator.GenerateImageAsync(request.Prompt);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}

public class ImageGenerationDto
{
    [JsonPropertyName("prompt")]
    public string Prompt { get; set; }
}