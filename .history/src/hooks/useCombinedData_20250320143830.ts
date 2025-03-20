import { useQuery } from "@tanstack/react-query";
import { combinedApi } from "@/services/combinedApi";
import {
  BudgetDistribution,
  RecommendationItem,
  Product,
} from "@/types/product";

interface CombinedData {
  budgetDistribution: BudgetDistribution[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}

export const useCombinedData = () => {
  return useQuery<CombinedData, Error>({
    queryKey: ["combinedData"],
    queryFn: combinedApi.getCombinedData,
  });
};

// Hook to get only recommendations data
export const useRecommendations = () => {
  const { data, isLoading, error } = useCombinedData();

  return {
    data: data?.recommendations || {},
    budgetDistribution: data?.budgetDistribution || [],
    isLoading,
    error,
  };
};

// Hook to get only products data
export const useProducts = () => {
  const { data, isLoading, error } = useCombinedData();

  return {
    products: data?.products || [],
    isLoading,
    error,
  };
};
