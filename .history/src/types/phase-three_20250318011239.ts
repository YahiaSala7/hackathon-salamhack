// Product Types
export interface StoreDetails {
  id: string;
  phone: string;
  email: string;
  openingHours: string;
  address: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number;
  storeName: string;
  location: string;
  rating: number;
  coordinates: [number, number];
  description: string;
  features: string[];
  availability: boolean;
  discount: number;
  storeDetails: StoreDetails;
}

export interface ProductsResponse {
  products: Product[];
  metadata: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    timestamp: string;
  };
}

// Category Types
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  subcategories: string[];
}

export interface CategoriesResponse {
  categories: Category[];
  metadata: {
    lastUpdated: string;
    version: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Filter Types
export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  rating: number;
  storeProximity: number;
  sortBy: string;
}

// Pagination Types
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}
