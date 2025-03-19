export type Category =
  | "Living Room"
  | "Kitchen"
  | "Bedroom"
  | "Bathroom"
  | "Other Rooms";

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
  sortBy: string;
}
