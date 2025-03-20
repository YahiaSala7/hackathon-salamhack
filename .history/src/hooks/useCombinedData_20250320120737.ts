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
    queryFn: async () => {
      // First try to get data from localStorage
      const storedData = localStorage.getItem("submissionData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Retrieved data from localStorage:", parsedData);
        return parsedData;
      }

      // If no data in localStorage, fetch from API
      const result = await combinedApi.getCombinedData();
      console.log("Fetched data from API:", result);
      return result;
    },
    enabled: isFormSubmitted,
    staleTime: 1000 * 60 * 60 * 24, // Data stays fresh for 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // Cache persists for 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
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
