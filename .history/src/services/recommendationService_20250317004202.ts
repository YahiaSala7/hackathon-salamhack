import { RecommendationData, UserFormData } from "@/types/recommendation";

// Placeholder data
export const placeholderData: RecommendationData = {
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
      // ... other items
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
      // ... other items
    ],
    // ... other categories
  },
};

export const getRecommendations = async (
  formData: UserFormData
): Promise<RecommendationData> => {
  try {
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

// Function to check if user has submitted form data
export const hasSubmittedFormData = (): boolean => {
  // You can implement your own logic here to check if the user has submitted the form
  // For example, check localStorage, context, or redux store
  return false; // Default to false for now
};
