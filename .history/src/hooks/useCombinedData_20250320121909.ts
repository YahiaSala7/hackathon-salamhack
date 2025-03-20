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
        try {
          const parsedData = JSON.parse(storedData);
          console.log("Retrieved data from localStorage:", parsedData);
          return parsedData;
        } catch (error) {
          console.error("Error parsing stored data:", error);
          localStorage.removeItem("submissionData"); // Clear invalid data
        }
      }

      // If no data in localStorage or invalid data, fetch from API
      try {
        const result = await combinedApi.getCombinedData();
        console.log("Fetched data from API:", result);

        // Store the fetched data in localStorage
        if (result) {
          localStorage.setItem("submissionData", JSON.stringify(result));
        }

        return result;
      } catch (error) {
        console.error("Error fetching data from API:", error);
        throw error;
      }
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
