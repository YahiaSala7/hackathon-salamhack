using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SmartHomePlanner.Api.DTOS
{
    // Root response DTO
    public class HomeSetupResponseDto
    {
        [JsonPropertyName("budgetDistribution")]
        public List<BudgetDistributionDto> BudgetDistribution { get; set; }

        [JsonPropertyName("recommendations")]
        public RoomRecommendationsDto Recommendations { get; set; }

        [JsonPropertyName("products")]
        public List<ProductDto> Products { get; set; }
    }

    // Budget distribution item
    public class BudgetDistributionDto
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("value")]
        public int Value { get; set; }
    }

    // Recommendations by room type
    public class RoomRecommendationsDto
    {
        [JsonPropertyName("Living Rooms")]
        public List<RecommendationItemDto> LivingRooms { get; set; }

        [JsonPropertyName("Bedrooms")]
        public List<RecommendationItemDto> Bedrooms { get; set; }

        [JsonPropertyName("Kitchen")]
        public List<RecommendationItemDto> Kitchen { get; set; }

        [JsonPropertyName("Bathrooms")]
        public List<RecommendationItemDto> Bathrooms { get; set; }

        [JsonPropertyName("Other Rooms")]
        public List<RecommendationItemDto> OtherRooms { get; set; }
    }

    // Individual recommendation item
    public class RecommendationItemDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("category")]
        public string Category { get; set; }

        [JsonPropertyName("price")]
        public decimal Price { get; set; }

        [JsonPropertyName("rating")]
        public double Rating { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("link")]
        public string Link { get; set; }

        [JsonPropertyName("image")]
        public string Image { get; set; }
    }

    // Product DTO with nested information
    public class ProductDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; }

        [JsonPropertyName("category")]
        public string Category { get; set; }

        [JsonPropertyName("image")]
        public ProductImageDto Image { get; set; }

        [JsonPropertyName("price")]
        public decimal Price { get; set; }

        [JsonPropertyName("store")]
        public StoreDto Store { get; set; }

        [JsonPropertyName("rating")]
        public double Rating { get; set; }

        [JsonPropertyName("location")]
        public string Location { get; set; }

        [JsonPropertyName("coordinates")]
        public double[] Coordinates { get; set; }
    }

    // Product image info
    public class ProductImageDto
    {
        [JsonPropertyName("url")]
        public string Url { get; set; }

        [JsonPropertyName("alt")]
        public string Alt { get; set; }

        [JsonPropertyName("thumbnailUrl")]
        public string ThumbnailUrl { get; set; }
    }

    // Store information
    public class StoreDto
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("location")]
        public StoreLocationDto Location { get; set; }

        [JsonPropertyName("contact")]
        public StoreContactDto Contact { get; set; }

        [JsonPropertyName("operatingHours")]
        public OperatingHoursDto OperatingHours { get; set; }
    }

    // Store location
    public class StoreLocationDto
    {
        [JsonPropertyName("address")]
        public string Address { get; set; }

        [JsonPropertyName("city")]
        public string City { get; set; }

        [JsonPropertyName("country")]
        public string Country { get; set; }
    }

    // Store contact information
    public class StoreContactDto
    {
        [JsonPropertyName("phone")]
        public string Phone { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }
    }

    // Store operating hours
    public class OperatingHoursDto
    {
        [JsonPropertyName("days")]
        public string Days { get; set; }

        [JsonPropertyName("hours")]
        public string Hours { get; set; }
    }
}