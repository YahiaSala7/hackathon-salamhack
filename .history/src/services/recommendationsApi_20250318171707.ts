import { ApiResponse, ApiError } from "./api";
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
   * @returns Promise with recommendations data
   * @throws ApiError if the request fails
   */
  getRecommendations: async (): Promise<ApiResponse<RecommendationsData>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/phase-two/recommendations`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new ApiError("Failed to fetch recommendations", response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new ApiError("Failed to fetch recommendations", 500);
    }
  },
};
