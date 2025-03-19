import { ApiResponse, ApiError } from "./api";
import { FormData } from "@/types/formData";
import { RecommendationsData } from "@/types/recommendations";

/**
 * API Configuration
 * Base URL for the recommendations API endpoint
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Recommendations API Service
 * Handles all API calls related to product recommendations
 */
export const recommendationsApi = {
  /**
   * Fetch personalized recommendations based on user's form data
   * @param formData - The user's form data containing preferences and requirements
   * @returns Promise with recommendations data
   * @throws ApiError if the request fails
   */
  getRecommendations: async (
    formData: FormData
  ): Promise<ApiResponse<RecommendationsData>> => {
    try {
      // Make POST request to recommendations endpoint
      const response = await fetch(
        `${API_BASE_URL}/phase-two/recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || "Failed to fetch recommendations",
          errorData
        );
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
      throw new ApiError(500, "Failed to fetch recommendations");
    }
  },
};
