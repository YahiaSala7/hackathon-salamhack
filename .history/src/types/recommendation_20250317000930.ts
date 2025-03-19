export interface BudgetData {
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
  [key: string]: RecommendationItem[];
}

export interface RecommendationData {
  budgetDistribution: BudgetData[];
  recommendations: RecommendationsByCategory;
}

export interface UserFormStatus {
  isSubmitted: boolean;
  userId?: string;
}
