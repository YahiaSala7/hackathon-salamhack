import { ApiResponse, ApiError } from "./api";
import { Product } from "@/types/product";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const productsApi = {
  // Get products based on form data
  getProducts: async (formData: any): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || "Failed to fetch products",
          errorData
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to fetch products");
    }
  },
};
