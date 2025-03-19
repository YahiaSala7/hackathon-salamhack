import { api } from "./api";
import { Category } from "@/types/product";

export interface BudgetEntry {
  name: string;
  value: number;
}

export interface RecommendationItem {
  id: number;
  title: string;
  category: string;
  price: string;
  rating: number;
  description: string;
  link: string;
  image: string;
}

export interface Product {
  id: string;
  title: string;
  category: Category;
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
}

export interface CombinedData {
  budgetDistribution: BudgetEntry[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}

export const combinedApi = {
  getCombinedData: async (): Promise<CombinedData> => {
    const response = await api.getHomeData("combined-data");
    if (!response.data) {
      throw new Error("No data received from API");
    }
    return response.data as CombinedData;
  },
};
