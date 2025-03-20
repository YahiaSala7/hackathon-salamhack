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

export const useCombinedData = (isFormSubmitted: boolean = false) => {
  return useQuery<CombinedData, Error>({
    queryKey: ["combinedData"],
    queryFn: combinedApi.getCombinedData,
    enabled: isFormSubmitted,
    staleTime: 1000 * 60 * 60 * 24, // Data stays fresh for 24 hours
    cacheTime: 1000 * 60 * 60 * 24 * 7, // Cache persists for 7 days
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnReconnect: false, // Don't refetch when network reconnects
  });
};

// Hook to get only recommendations data
export const useRecommendations = (isFormSubmitted: boolean = false) => {
  const { data, isLoading, error } = useCombinedData(isFormSubmitted);

  return {
    data: data?.recommendations || {},
    budgetDistribution: data?.budgetDistribution || [],
    isLoading,
    error,
  };
};

// Hook to get only products data
export const useProducts = (isFormSubmitted: boolean = false) => {
  const { data, isLoading, error } = useCombinedData(isFormSubmitted);

  return {
    products: data?.products || [],
    isLoading,
    error,
  };
};
