using Microsoft.AspNetCore.Mvc;
using SalamHack.Data.DTOS.Furniture;
using SalamHack.Services.Interfaces;

namespace SalamHack.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FurnitureController : ControllerBase
    {
        private readonly IFurnitureService _furnitureService;

        public FurnitureController(IFurnitureService furnitureService)
        {
            _furnitureService = furnitureService;
        }

        // GET: api/furniture/{id}
        [HttpGet("{furnitureId}")]
        public async Task<ActionResult<FurnitureDto>> GetFurniture(int furnitureId)
        {
            var furniture = await _furnitureService.GetFurnitureByIdAsync(furnitureId);

            if (furniture == null)
            {
                return NotFound();
            }

            return Ok(furniture);
        }

        // GET: api/furniture/room/{roomId}
        [HttpGet("room/{roomId}")]
        public async Task<ActionResult<List<FurnitureDto>>> GetRoomFurniture(int roomId)
        {
            var furnitureList = await _furnitureService.GetRoomFurnitureAsync(roomId);
            return Ok(furnitureList);
        }

        // POST: api/furniture
        [HttpPost]
        public async Task<ActionResult<FurnitureDto>> CreateFurniture([FromBody] FurnitureCreateDto furnitureCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdFurniture = await _furnitureService.CreateFurnitureAsync(furnitureCreateDto);
            return CreatedAtAction(nameof(GetFurniture), new { furnitureId = createdFurniture.FurnitureId }, createdFurniture);
        }

        // PUT: api/furniture/{id}
        [HttpPut("{furnitureId}")]
        public async Task<ActionResult<FurnitureDto>> UpdateFurniture(int furnitureId, [FromBody] FurnitureCreateDto furnitureUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedFurniture = await _furnitureService.UpdateFurnitureAsync(furnitureId, furnitureUpdateDto);

            if (updatedFurniture == null)
            {
                return NotFound();
            }

            return Ok(updatedFurniture);
        }

        // DELETE: api/furniture/{id}
        [HttpDelete("{furnitureId}")]
        public async Task<ActionResult> DeleteFurniture(int furnitureId)
        {
            var result = await _furnitureService.DeleteFurnitureAsync(furnitureId);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}