import { RecommendationsResponse } from "@/types/recommendations";

// Preview data (same as current static data)
const previewData: RecommendationsResponse = {
  isPreview: true,
  data: {
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
          description:
            "Our team was inspired by the seven skills of highly effective programmers",
          image:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3",
        },
        // ... keep existing items
      ],
      Kitchen: [
        {
          id: 5,
          title: "Modern Kitchen Cabinet",
          category: "Kitchen",
          price: "80$",
          rating: 5,
          description: "High-quality kitchen cabinet with modern design",
          image:
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3",
        },
        // ... keep existing items
      ],
      Bedrooms: [
        {
          id: 8,
          title: "Queen Size Bed",
          category: "Bedrooms",
          price: "150$",
          rating: 5,
          description: "Comfortable queen size bed with storage",
          image:
            "https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3",
        },
        // ... keep existing items
      ],
      Bathrooms: [
        {
          id: 11,
          title: "Bathroom Vanity",
          category: "Bathrooms",
          price: "100$",
          rating: 4,
          description: "Modern bathroom vanity with mirror",
          image:
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3",
        },
        // ... keep existing items
      ],
    },
  },
};

export const getRecommendations = async (
  userId?: string
): Promise<RecommendationsResponse> => {
  if (!userId) {
    return previewData;
  }

  try {
    const response = await fetch(`/api/recommendations/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }
    const data = await response.json();
    return {
      isPreview: false,
      data,
    };
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};
