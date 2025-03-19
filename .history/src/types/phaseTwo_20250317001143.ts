export interface RecommendationItem {
  id: number;
  title: string;
  category: string;
  price: string;
  rating: number;
  description: string;
  image: string;
}

export interface BudgetItem {
  name: string;
  value: number;
}

export interface PhaseTwoData {
  budgetDistribution: BudgetItem[];
  recommendations: {
    [key: string]: RecommendationItem[];
  };
}

export interface PhaseTwoState {
  isPreview: boolean;
  data: PhaseTwoData;
}
