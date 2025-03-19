import { useState, useCallback, useMemo } from "react";

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
}

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  rating: number;
  storeProximity: number;
  sortBy: string;
}

const INITIAL_FILTERS: FilterState = {
  priceRange: [0, 1000],
  categories: [],
  rating: 0,
  storeProximity: 10,
  sortBy: "price",
};

// Sample data - replace with actual API call in production
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Modern Wooden Chair",
    category: "Living Room",
    image: "/placeholder.jpg",
    price: 199,
    storeName: "Furniture Plus",
    location: "San Francisco",
    rating: 4.5,
    coordinates: [37.7749, -122.4194],
  },
  {
    id: "2",
    title: "Elegant Dining Table",
    category: "Kitchen",
    image: "/placeholder.jpg",
    price: 599,
    storeName: "Home Essentials",
    location: "Oakland",
    rating: 4.8,
    coordinates: [37.8044, -122.2712],
  },
  {
    id: "3",
    title: "Comfortable Sofa",
    category: "Living Room",
    image: "/placeholder.jpg",
    price: 899,
    storeName: "Cozy Home",
    location: "Berkeley",
    rating: 4.2,
    coordinates: [37.8715, -122.273],
  },
];

export const useProducts = () => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [products] = useState<Product[]>(SAMPLE_PRODUCTS);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Price range filter
        if (
          product.price < filters.priceRange[0] ||
          product.price > filters.priceRange[1]
        ) {
          return false;
        }

        // Category filter
        if (
          filters.categories.length > 0 &&
          !filters.categories.includes(product.category)
        ) {
          return false;
        }

        // Rating filter
        if (product.rating < filters.rating) {
          return false;
        }

        // Store proximity filter would go here
        // Would need to calculate actual distance from user's location

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price":
            return a.price - b.price;
          case "rating":
            return b.rating - a.rating;
          case "distance":
            // Would need to calculate actual distance from user's location
            return 0;
          default:
            return 0;
        }
      });
  }, [filters, products]);

  const handlePriceRangeChange = useCallback((newValue: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: newValue }));
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const handleRatingChange = useCallback((rating: number) => {
    setFilters((prev) => ({ ...prev, rating }));
  }, []);

  const handleProximityChange = useCallback((proximity: number) => {
    setFilters((prev) => ({ ...prev, storeProximity: proximity }));
  }, []);

  const handleSortChange = useCallback((sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  return {
    filters,
    products: filteredProducts,
    handlePriceRangeChange,
    handleCategoryChange,
    handleRatingChange,
    handleProximityChange,
    handleSortChange,
  };
};
