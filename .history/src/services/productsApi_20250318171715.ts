import { ApiResponse, ApiError } from "./api";
import { FormData } from "@/types/formData";
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
  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    try {
      // Make GET request to products endpoint
      const response = await fetch(`${API_BASE_URL}/phase-three/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle non-200 responses
      if (!response.ok) {
        throw new ApiError("Failed to fetch products", response.status);
      }

      // Parse and return successful response
      const data = await response.json();
      return data;
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
