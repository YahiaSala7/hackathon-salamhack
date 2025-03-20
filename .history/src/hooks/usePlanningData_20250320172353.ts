import {
  BudgetDistribution,
  Product,
  RecommendationItem,
} from "@/types/product";
import { useQueryClient } from "@tanstack/react-query";
interface CombinedData {
  budgetDistribution: BudgetDistribution[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}
export const usePlanningData = () => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<CombinedData>(["planningData"]);
  return data ?? null;
};
