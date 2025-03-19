export interface BudgetDistribution {
  name: string;
  value: number;
}

export interface RecommendationItem {
  id: number;
  title: string;
  category: string;
  price: string;
  rating: number;
  description: string;
  image: string;
}

export interface RecommendationsByCategory {
  [category: string]: RecommendationItem[];
}

export interface RecommendationsData {
  budgetDistribution: BudgetDistribution[];
  recommendations: RecommendationsByCategory;
}

export interface RecommendationsResponse {
  success: boolean;
  data: RecommendationsData;
  message: string;
}
