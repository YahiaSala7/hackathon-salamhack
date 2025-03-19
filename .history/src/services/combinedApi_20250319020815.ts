import { api } from "./api";

export interface CombinedData {
  budgetDistribution: {
    name: string;
    value: number;
  }[];
  recommendations: {
    [key: string]: {
      id: number;
      title: string;
      category: string;
      price: number;
      rating: number;
      description: string;
      link: string;
      image: string;
    }[];
  };
  products: {
    id: string;
    title: string;
    category: string;
    image: {
      url: string;
      alt: string;
      thumbnailUrl: string;
    };
    price: number;
    store: {
      id: string;
      name: string;
      location: {
        address: string;
        city: string;
        country: string;
      };
      contact: {
        phone: string;
        email: string;
      };
      operatingHours: {
        days: string;
        hours: string;
      };
    };
    rating: number;
    location: string;
    coordinates: [number, number];
  }[];
}

export const combinedApi = {
  getCombinedData: async (): Promise<CombinedData> => {
    const response = await api.get("/combined-data");
    return response.data;
  },
};
