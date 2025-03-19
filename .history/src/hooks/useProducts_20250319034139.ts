import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/services/productsApi";
import { fakeProductsData } from "@/utils/fakeProducts";
import { Product } from "@/types/product";

const INITIAL_FILTERS: FilterState = {
  priceRange: [0, 1000],
  categories: [],
  rating: 0,
  storeProximity: 10,
  sortBy: "price",
};

// Sample data for preview
const SAMPLE_PRODUCTS: Product[] = Array(30)
  .fill(null)
  .map((_, index) => {
    const categories: Category[] = [
      "Living Room",
      "Kitchen",
      "Bedroom",
      "Bathroom",
      "Other Rooms",
    ];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    return {
      id: `product-${index}`,
      title: `Sample Product ${index + 1}`,
      category: randomCategory,
      image: {
        url: "https://example.com/image.jpg",
        alt: `Sample Product ${index + 1}`,
        thumbnailUrl: "https://example.com/thumbnail.jpg",
      },
      price: Math.floor(Math.random() * 900) + 100,
      store: {
        id: `store-${Math.floor(Math.random() * 10) + 1}`,
        name: `Store ${Math.floor(Math.random() * 10) + 1}`,
        location: {
          address: `${Math.floor(Math.random() * 1000)} Main St`,
          city: "San Francisco",
          country: "USA",
        },
        contact: {
          phone: `+1 (555) ${Math.floor(Math.random() * 9000) + 1000}`,
          email: `store${Math.floor(Math.random() * 10) + 1}@example.com`,
        },
        operatingHours: {
          days: "Mon-Sun",
          hours: "9:00 AM - 6:00 PM",
        },
      },
      rating: Math.random() * 3 + 2,
      location: `Location ${Math.floor(Math.random() * 10) + 1}`,
      coordinates: [
        37.7749 + (Math.random() - 0.5) * 0.1,
        -122.4194 + (Math.random() - 0.5) * 0.1,
      ] as [number, number],
    };
  });

export const useProducts = (formData: any, isFormSubmitted: boolean) => {
  return useQuery<Product[], Error>({
    queryKey: ["products", formData],
    queryFn: () => {
      if (!isFormSubmitted) {
        return Promise.resolve(fakeProductsData);
      }
      return productsApi.getProducts(formData);
    },
    enabled: true,
  });
};
