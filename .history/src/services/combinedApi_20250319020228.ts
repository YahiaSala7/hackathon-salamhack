import { api } from "./api";
import { BudgetEntry, RecommendationItem, Product } from "@/types/product";

interface CombinedData {
  budgetDistribution: BudgetEntry[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}

export const combinedApi = {
  getAllData: async (): Promise<CombinedData> => {
    const response = await api.get("/combined-data");
    return response.data;
  },
};
