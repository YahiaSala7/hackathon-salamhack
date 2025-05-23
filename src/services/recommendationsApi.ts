import { ApiResponse, ApiError } from "./api";
import { RecommendationsData } from "@/types/recommendations";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const recommendationsApi = {
  // Get recommendations
  getRecommendations: async (): Promise<ApiResponse<RecommendationsData>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || "Failed to fetch recommendations",
          errorData
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to fetch recommendations");
    }
  },
};
