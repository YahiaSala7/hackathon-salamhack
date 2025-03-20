export interface FormData {
  currency: "USD" | "EUR" | "GBP";
  budget: number;
  occupants: string;
  areaUnit: "m²" | "ft²";
  area: number;
  bedrooms: number;
  bathrooms: number;
  livingRoom: number;
  kitchen: number;
  otherRooms?: string;
  location: string;
  style: string;
}
