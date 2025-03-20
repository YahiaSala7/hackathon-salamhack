export interface PlanningResponse {
  id: string;
  budgetDistribution: BudgetDistribution[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}