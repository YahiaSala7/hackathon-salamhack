import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
import { Product } from "@/types/product";

interface BudgetEntry {
  name: string;
  value: number;
}

interface RecommendationItem {
  id: number;
  title: string;
  category: string;
  price: string;
  rating: number;
  description: string;
  image: string;
}

interface AllData {
  budgetDistribution: BudgetEntry[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}

export function useAllData(formData: FormData | null) {
  return useQuery<AllData, Error>({
    queryKey: ["allData", formData],
    queryFn: () => api.getAllData(formData!),
    enabled: !!formData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
