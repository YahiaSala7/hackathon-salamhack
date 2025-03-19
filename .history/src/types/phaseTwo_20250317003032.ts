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

export interface PhaseTwoData {
  budgetData: BudgetData[];
  recommendations: RecommendationsByCategory;
  isLoading: boolean;
  error: unknown;
  isPreviewMode: boolean;
}
