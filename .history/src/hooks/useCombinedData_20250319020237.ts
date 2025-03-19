import { useQuery } from "@tanstack/react-query";
import { combinedApi } from "@/services/combinedApi";
import { BudgetEntry, RecommendationItem, Product } from "@/types/product";

interface CombinedData {
  budgetDistribution: BudgetEntry[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}

export const useCombinedData = () => {
  return useQuery<CombinedData, Error>({
    queryKey: ["combinedData"],
    queryFn: combinedApi.getAllData,
  });
};
