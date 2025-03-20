import { useQuery } from "@tanstack/react-query";
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
      // Try to get data from localStorage first
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

      // If no data in localStorage, throw an error
      throw new Error("No data available. Please submit the form first.");
    },
    enabled: isFormSubmitted,
    staleTime: Infinity, // Data stays fresh forever since it comes from form submission
    gcTime: 1000 * 60 * 60 * 24 * 7, // Cache persists for 7 days
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false, // Don't retry if data is not available
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
