import { ApiResponse, ApiError } from "./api";
import { Product } from "@/types/product";

/**
 * API Configuration
 * Base URL for the products API endpoint
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Products API Service
 * Handles all API calls related to product data
 */
export const productsApi = {
  /**
   * Fetch products based on user's form data and preferences
   * @param formData - The user's form data containing preferences and requirements
   * @returns Promise with an array of products
   * @throws ApiError if the request fails
   */
  getProducts: async (formData: any): Promise<ApiResponse<Product[]>> => {
    try {
      // Make POST request to products endpoint
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || "Failed to fetch products",
          errorData
        );
      }

      // Parse and return successful response
      return response.json();
    } catch (error) {
      // Handle API errors
      if (error instanceof ApiError) {
        throw error;
      }
      // Handle unexpected errors
      throw new ApiError(500, "Failed to fetch products");
    }
  },
};
