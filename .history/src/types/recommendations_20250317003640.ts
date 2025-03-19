export interface RecommendationItem {
  id: number;
  title: string;
  category: string;
  price: string;
  rating: number;
  description: string;
  image: string;
}

export interface BudgetDistribution {
  name: string;
  value: number;
}

export interface RecommendationsData {
  budgetDistribution: BudgetDistribution[];
  recommendations: {
    [category: string]: RecommendationItem[];
  };
}

export interface RecommendationsResponse {
  success: boolean;
  data: RecommendationsData;
  message: string;
}
