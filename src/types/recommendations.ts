export interface BudgetDistribution {
  name: string;
  value: number;
}

export interface RecommendationItem {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  link: string;
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
