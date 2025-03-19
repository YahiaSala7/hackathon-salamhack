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
  [key: string]: RecommendationItem[];
}

export interface RecommendationData {
  budgetDistribution: BudgetItem[];
  recommendations: RecommendationsByCategory;
}

export interface UserFormData {
  // Add your form fields here based on your requirements
  budget?: number;
  preferences?: string[];
  roomTypes?: string[];
  // ... other fields
}
