import { ApiResponse, ApiError } from "./api";

interface GenerateImageRequest {
  prompt: string;
}

interface GenerateImageResponse {
  imageUrl: string;
}

const API_BASE_URL = "https://designture.runasp.net/api/Plan";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || "An error occurred",
      errorData
    );
  }

  return response.json();
}

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

      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to generate image");
    }
  },
};
