import { FormData } from "@/types/formData";
import { Product } from "@/types/product";
import { fetchApi } from "./api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const productsApi = {
  // Get products based on form data
  getProducts: async (formData: FormData): Promise<Product[]> => {
    const response = await fetchApi<Product[]>("/products", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    return response.data;
  },
};
