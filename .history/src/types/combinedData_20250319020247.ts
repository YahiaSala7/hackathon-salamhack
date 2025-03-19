import { Product } from "./product";

export interface BudgetEntry {
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

export interface CombinedData {
  budgetDistribution: BudgetEntry[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}
