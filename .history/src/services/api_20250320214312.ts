import { FormData } from "@/types/formData";

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

// API Error Type
export class ApiError extends Error {
  constructor(public statusCode: number, message: string, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

// API Configuration
// https://designture.runasp.net/api/Plan
const API_BASE_URL = "";
const API_TIMEOUT = 30000; // 30 seconds

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

// API Service
export const api = {
  // Submit home data
  submitHomeData: async (
    data: FormData
  ): Promise<ApiResponse<{ id: string }>> => {
    try {
      console.log("Making API call with data:", data);
      const response = await fetch(`${API_BASE_URL}/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("API response:", response);
      return handleResponse(response);
    } catch (error) {
      console.error("API error:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to submit home data");
    }
  },
};
