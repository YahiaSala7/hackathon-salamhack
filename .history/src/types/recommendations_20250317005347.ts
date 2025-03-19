export interface BudgetItem {
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
  budgetDistribution: BudgetItem[];
  recommendations: RecommendationsByCategory;
}

// Preview data type to distinguish between real and preview data
export interface RecommendationsResponse {
  isPreview: boolean;
  data: RecommendationsData;
}
