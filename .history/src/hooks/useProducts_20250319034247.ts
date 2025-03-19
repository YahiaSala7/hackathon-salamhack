import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/services/productsApi";
import { fakeProductsData } from "@/utils/fakeProducts";
import { Product } from "@/types/product";

export const useProducts = (formData: any, isFormSubmitted: boolean) => {
  return useQuery<Product[], Error>({
    queryKey: ["products", formData],
    queryFn: async () => {
      if (!isFormSubmitted) {
        return fakeProductsData;
      }
      const response = await productsApi.getProducts();
      return response.data || fakeProductsData;
    },
    enabled: true,
  });
};
