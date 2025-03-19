export type Category =
  | "Living Room"
  | "Kitchen"
  | "Bedroom"
  | "Bathroom"
  | "Other Rooms";

export interface FormData {
  budget: number;
  rooms: string[];
  style: string;
  location: string;
}

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
  link: string;
  image: string;
}

export interface Image {
  url: string;
  alt: string;
  thumbnailUrl: string;
}

export interface StoreLocation {
  address: string;
  city: string;
  country: string;
}

export interface StoreContact {
  phone: string;
  email: string;
}

export interface StoreOperatingHours {
  days: string;
  hours: string;
}

export interface Store {
  id: string;
  name: string;
  location: StoreLocation;
  contact: StoreContact;
  operatingHours: StoreOperatingHours;
}

export interface Product {
  id: string;
  title: string;
  category: Category;
  image: Image;
  price: number;
  store: Store;
  rating: number;
  location: string;
  coordinates: [number, number];
}

export interface FilterState {
  priceRange: [number, number];
  categories: Category[];
  rating: number;
  storeProximity: number;
  sortBy: "price" | "rating" | "distance";
}
