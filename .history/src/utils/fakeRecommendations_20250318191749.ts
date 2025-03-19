import { RecommendationsData } from "@/types/recommendations";

export const fakeRecommendationsData: RecommendationsData = {
  budgetDistribution: [
    {
      name: "Living Room",
      value: 30,
    },
    {
      name: "Kitchen",
      value: 25,
    },
    {
      name: "Bedrooms",
      value: 20,
    },
    {
      name: "Bathrooms",
      value: 15,
    },
    {
      name: "Other Rooms",
      value: 10,
    },
  ],
  recommendations: {
    "Living Rooms": [
      {
        id: 1,
        title: "Modern Sofa",
        category: "Living Room",
        price: "1200",
        rating: 4.5,
        description: "Comfortable modern sofa with durable fabric",
        image:
          "https://image.pollinations.ai/prompt/Modern,comfortable,sofa,durable,fabric,living,room",
      },
    ],
    Bedrooms: [
      {
        id: 2,
        title: "Orthopedic Mattress",
        category: "Bedroom",
        price: "800",
        rating: 4.7,
        description: "High-quality orthopedic mattress for a comfortable sleep",
        image:
          "https://image.pollinations.ai/prompt/Orthopedic,mattress,comfortable,sleep,bedroom",
      },
    ],
    Kitchen: [
      {
        id: 3,
        title: "Stainless Steel Refrigerator",
        category: "Kitchen",
        price: "1500",
        rating: 4.6,
        description: "Energy-efficient stainless steel refrigerator",
        image:
          "https://image.pollinations.ai/prompt/Stainless,steel,refrigerator,energy,efficient,kitchen",
      },
    ],
    Bathrooms: [
      {
        id: 4,
        title: "Modern Shower Head",
        category: "Bathroom",
        price: "200",
        rating: 4.3,
        description: "Stylish modern shower head with multiple settings",
        image:
          "https://image.pollinations.ai/prompt/Modern,shower,head,multiple,settings,bathroom",
      },
    ],
    "Other Rooms": [
      {
        id: 5,
        title: "Study Desk",
        category: "Other Room",
        price: "300",
        rating: 4.2,
        description: "Ergonomic study desk for a comfortable workspace",
        image:
          "https://image.pollinations.ai/prompt/Ergonomic,study,desk,comfortable,workspace",
      },
    ],
  },
};
