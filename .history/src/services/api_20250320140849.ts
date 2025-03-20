import { FormData } from "@/types/formData";

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
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
const API_BASE_URL = "https://designture.runasp.net/api/Plan";
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

interface HomeSubmissionResponse {
  id: string;
  budgetDistribution: any[];
  recommendations: Record<string, any[]>;
  products: any[];
}

// API Service
export const api = {
  // Submit home data
  submitHomeData: async (
    data: FormData
  ): Promise<ApiResponse<HomeSubmissionResponse>> => {
    try {
      console.log("Making API call with data:", data);

      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("API response:", response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || `HTTP error! status: ${response.status}`,
          errorData
        );
      }

      const result = await response.json();
      console.log("API response data:", result);
      return result;
    } catch (error) {
      console.error("API error:", error);

      // Handle specific error types
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError(408, "Request timeout");
        }
        throw new ApiError(500, error.message);
      }

      throw new ApiError(500, "Failed to submit home data");
    }
  },

  // Get home data by ID
  getHomeData: async (id: string): Promise<ApiResponse<FormData>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/homes/${id}`);
      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to fetch home data");
    }
  },

  // Update home data
  updateHomeData: async (
    id: string,
    data: Partial<FormData>
  ): Promise<ApiResponse<FormData>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/homes/${id}`, {
        method: "PATCH",
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
      throw new ApiError(500, "Failed to update home data");
    }
  },
};
