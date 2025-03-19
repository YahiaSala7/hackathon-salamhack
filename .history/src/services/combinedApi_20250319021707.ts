import {
  BudgetDistribution,
  RecommendationItem,
  Product,
} from "@/types/product";

interface CombinedResponse {
  budgetDistribution: BudgetDistribution[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const combinedApi = {
  async getCombinedData(): Promise<CombinedResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/combined-data`);
      if (!response.ok) {
        throw new Error("Failed to fetch combined data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching combined data:", error);
      throw error;
    }
  },
};
