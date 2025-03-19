import { RecommendationsData } from "@/types/recommendations";

export const fakeRecommendationsData: RecommendationsData = {
  budgetDistribution: [
    { name: "Living Room", value: 30 },
    { name: "Kitchen", value: 20 },
    { name: "Bedrooms", value: 20 },
    { name: "Bathrooms", value: 15 },
    { name: "Other Rooms", value: 15 },
  ],
  recommendations: {
    "Living Room": [
      {
        id: 1,
        title: "Modern Sofa",
        category: "Living Room",
        price: "50$",
        rating: 4,
        description: "Preview: Elegant modern sofa with premium comfort",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3",
      },
      {
        id: 2,
        title: "Comfort Couch",
        category: "Living Room",
        price: "50$",
        rating: 4,
        description: "Preview: Spacious couch perfect for family gatherings",
        image:
          "https://images.unsplash.com/photo-1506898667547-42e22a46e125?ixlib=rb-4.0.3",
      },
    ],
    Kitchen: [
      {
        id: 3,
        title: "Modern Cabinet",
        category: "Kitchen",
        price: "80$",
        rating: 5,
        description: "Preview: High-quality kitchen cabinet with modern design",
        image:
          "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3",
      },
      {
        id: 4,
        title: "Kitchen Island",
        category: "Kitchen",
        price: "120$",
        rating: 4,
        description: "Preview: Spacious kitchen island with storage",
        image:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3",
      },
    ],
    Bedrooms: [
      {
        id: 5,
        title: "Queen Size Bed",
        category: "Bedrooms",
        price: "150$",
        rating: 5,
        description: "Preview: Comfortable queen size bed with storage",
        image:
          "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3",
      },
      {
        id: 6,
        title: "Wardrobe",
        category: "Bedrooms",
        price: "90$",
        rating: 4,
        description: "Preview: Spacious wardrobe with mirror",
        image:
          "https://images.unsplash.com/photo-1558997519-83ea9252edf8?ixlib=rb-4.0.3",
      },
    ],
    Bathrooms: [
      {
        id: 7,
        title: "Vanity Set",
        category: "Bathrooms",
        price: "100$",
        rating: 4,
        description: "Preview: Modern bathroom vanity with mirror",
        image:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3",
      },
      {
        id: 8,
        title: "Shower Set",
        category: "Bathrooms",
        price: "70$",
        rating: 5,
        description: "Preview: Complete shower set with rainfall head",
        image:
          "https://images.unsplash.com/photo-1584622781867-1c5fe959394b?ixlib=rb-4.0.3",
      },
    ],
  },
};
