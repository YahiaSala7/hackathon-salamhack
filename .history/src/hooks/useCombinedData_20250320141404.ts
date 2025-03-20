import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
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

export const useCombinedData = (formData: FormData | null) => {
  return useQuery({
    queryKey: ["homeData", formData?.id],
    queryFn: () => api.submitHomeData(formData!),
    enabled: !!formData,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const useRecommendations = (formData: FormData | null) => {
  return useQuery({
    queryKey: ["recommendations", formData?.id],
    queryFn: () => api.submitHomeData(formData!),
    select: (data) => data.data.recommendations,
    enabled: !!formData,
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 7 * 24 * 60 * 60 * 1000,
  });
};

export const useProducts = (formData: FormData | null) => {
  return useQuery({
    queryKey: ["products", formData?.id],
    queryFn: () => api.submitHomeData(formData!),
    select: (data) => data.data.products,
    enabled: !!formData,
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 7 * 24 * 60 * 60 * 1000,
  });
};
