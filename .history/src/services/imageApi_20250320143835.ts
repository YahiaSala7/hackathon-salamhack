import { ApiResponse, ApiError } from "./api";

interface GenerateImageRequest {
  prompt: string;
}

interface GenerateImageResponse {
  imageUrl: string;
}

const API_BASE_URL = "http://designture.runasp.net/api/Plan";

export const imageApi = {
  generateImage: async (
    data: GenerateImageRequest
  ): Promise<ApiResponse<GenerateImageResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || "Failed to generate image",
          errorData
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to generate image");
    }
  },
};
