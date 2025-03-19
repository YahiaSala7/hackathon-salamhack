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
        price: 1200,
        rating: 4.5,
        description: "Comfortable modern sofa with durable fabric",
        link: "https://example.com/sofa",
        image:
          "https://image.pollinations.ai/prompt/Modern,comfortable,sofa,durable,fabric,living,room",
      },
      {
        id: 2,
        title: "Comfort Couch",
        category: "Living Room",
        price: 50,
        rating: 4,
        description:
          "Preview: Spacious couch perfect for family gatherings and movie nights",
        link: "https://example.com/couch",
        image:
          "https://images.unsplash.com/photo-1506898667547-42e22a46e125?ixlib=rb-4.0.3",
      },
      {
        id: 3,
        title: "Smart TV Stand",
        category: "Living Room",
        price: 45,
        rating: 5,
        description:
          "Preview: Modern TV stand with built-in storage and cable management",
        link: "https://example.com/tv-stand",
        image:
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3",
      },
      {
        id: 4,
        title: "Coffee Table",
        category: "Living Room",
        price: 35,
        rating: 4,
        description:
          "Preview: Stylish coffee table with hidden storage and modern design",
        link: "https://example.com/coffee-table",
        image:
          "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3",
      },
    ],
    Kitchen: [
      {
        id: 5,
        title: "Modern Cabinet",
        category: "Kitchen",
        price: 80,
        rating: 5,
        description:
          "Preview: High-quality kitchen cabinet with modern design and soft-close hinges",
        link: "https://example.com/cabinet",
        image:
          "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3",
      },
      {
        id: 6,
        title: "Kitchen Island",
        category: "Kitchen",
        price: 120,
        rating: 4,
        description:
          "Preview: Spacious kitchen island with storage and built-in seating",
        link: "https://example.com/kitchen-island",
        image:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3",
      },
      {
        id: 7,
        title: "Smart Refrigerator",
        category: "Kitchen",
        price: 150,
        rating: 5,
        description:
          "Preview: Energy-efficient refrigerator with smart temperature control",
        link: "https://example.com/refrigerator",
        image:
          "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?ixlib=rb-4.0.3",
      },
      {
        id: 8,
        title: "Dishwasher",
        category: "Kitchen",
        price: 90,
        rating: 4,
        description:
          "Preview: Quiet dishwasher with multiple wash cycles and energy saving mode",
        link: "https://example.com/dishwasher",
        image:
          "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3",
      },
    ],
    Bedrooms: [
      {
        id: 9,
        title: "Queen Size Bed",
        category: "Bedrooms",
        price: 150,
        rating: 5,
        description:
          "Preview: Comfortable queen size bed with storage and premium mattress",
        link: "https://example.com/bed",
        image:
          "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3",
      },
      {
        id: 10,
        title: "Wardrobe",
        category: "Bedrooms",
        price: 90,
        rating: 4,
        description:
          "Preview: Spacious wardrobe with mirror and built-in lighting",
        link: "https://example.com/wardrobe",
        image:
          "https://images.unsplash.com/photo-1558997519-83ea9252edf8?ixlib=rb-4.0.3",
      },
      {
        id: 11,
        title: "Nightstand",
        category: "Bedrooms",
        price: 45,
        rating: 4,
        description:
          "Preview: Modern nightstand with USB charging ports and storage",
        link: "https://example.com/nightstand",
        image:
          "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3",
      },
      {
        id: 12,
        title: "Dresser",
        category: "Bedrooms",
        price: 75,
        rating: 5,
        description:
          "Preview: Elegant dresser with multiple drawers and mirror",
        link: "https://example.com/dresser",
        image:
          "https://images.unsplash.com/photo-1558997519-83ea9252edf8?ixlib=rb-4.0.3",
      },
    ],
    Bathrooms: [
      {
        id: 13,
        title: "Vanity Set",
        category: "Bathrooms",
        price: 100,
        rating: 4,
        description:
          "Preview: Modern bathroom vanity with mirror and LED lighting",
        link: "https://example.com/vanity",
        image:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3",
      },
      {
        id: 14,
        title: "Shower Set",
        category: "Bathrooms",
        price: 70,
        rating: 5,
        description:
          "Preview: Complete shower set with rainfall head and handheld unit",
        link: "https://example.com/shower",
        image:
          "https://images.unsplash.com/photo-1584622781867-1c5fe959394b?ixlib=rb-4.0.3",
      },
      {
        id: 15,
        title: "Smart Toilet",
        category: "Bathrooms",
        price: 120,
        rating: 5,
        description:
          "Preview: Smart toilet with bidet function and heated seat",
        link: "https://example.com/toilet",
        image:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3",
      },
      {
        id: 16,
        title: "Storage Cabinet",
        category: "Bathrooms",
        price: 55,
        rating: 4,
        description:
          "Preview: Water-resistant storage cabinet with multiple shelves",
        link: "https://example.com/cabinet",
        image:
          "https://images.unsplash.com/photo-1584622781867-1c5fe959394b?ixlib=rb-4.0.3",
      },
    ],
  },
};
