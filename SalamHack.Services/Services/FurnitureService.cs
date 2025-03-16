using AutoMapper;
using SalamHack.Data.DTOS.Furniture;
using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;
using SalamHack.Services.Interfaces;

namespace SalamHack.Services.Services
{
    public class FurnitureService : IFurnitureService
    {
        private readonly IFurnitureRepository _furnitureRepository;
        private readonly IPriceComparisonService _priceComparisonService;
        private readonly IMapper _mapper;

        public FurnitureService(
            IFurnitureRepository furnitureRepository,
            IPriceComparisonService priceComparisonService,
            IMapper mapper)
        {
            _furnitureRepository = furnitureRepository;
            _priceComparisonService = priceComparisonService;
            _mapper = mapper;
        }

        public async Task<FurnitureDto> GetFurnitureByIdAsync(int furnitureId)
        {
            var furniture = await _furnitureRepository.GetByIdAsync(furnitureId);
            return furniture != null ? _mapper.Map<FurnitureDto>(furniture) : null;
        }

        public async Task<List<FurnitureDto>> GetRoomFurnitureAsync(int roomId)
        {
            var furnitureList = await _furnitureRepository.GetByRoomIdAsync(roomId);
            return _mapper.Map<List<FurnitureDto>>(furnitureList);
        }

        public async Task<FurnitureDto> CreateFurnitureAsync(FurnitureCreateDto furnitureCreateDto)
        {
            // تحويل DTO إلى كيان باستخدام AutoMapper
            var furnitureEntity = _mapper.Map<Furniture>(furnitureCreateDto);
            var createdFurniture = await _furnitureRepository.CreateAsync(furnitureEntity);

            // جلب مقارنة الأسعار لهذا العنصر تلقائيًا
            await _priceComparisonService.GetFurniturePriceComparisonsAsync(createdFurniture.FurnitureId);

            // تحويل الكيان المُنشأ إلى DTO وإرجاعه
            return _mapper.Map<FurnitureDto>(createdFurniture);
        }

        public async Task<FurnitureDto> UpdateFurnitureAsync(int furnitureId, FurnitureCreateDto furnitureUpdateDto)
        {
            // التأكد من وجود العنصر أولاً
            var existingFurniture = await _furnitureRepository.GetByIdAsync(furnitureId);
            if (existingFurniture == null)
            {
                return null;
            }

            // استخدام AutoMapper لتحديث الكيان الموجود بالبيانات الجديدة من DTO
            _mapper.Map(furnitureUpdateDto, existingFurniture);
            var updatedFurniture = await _furnitureRepository.UpdateAsync(existingFurniture);
            return _mapper.Map<FurnitureDto>(updatedFurniture);
        }

        public async Task<bool> DeleteFurnitureAsync(int furnitureId)
        {
            return await _furnitureRepository.DeleteAsync(furnitureId);
        }
    }
}