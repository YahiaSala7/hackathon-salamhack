import { FormData } from "@/types/formData";
import { PhaseTwoData } from "@/types/phaseTwo";

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
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
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
      const response = await fetch(`${API_BASE_URL}/homes`, {
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

  // Get Phase Two data
  getPhaseTwoData: async (
    homeId: string
  ): Promise<ApiResponse<PhaseTwoData>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/homes/${homeId}/phase-two`);
      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to fetch phase two data");
    }
  },

  // Check if home data is submitted
  checkHomeSubmission: async (
    homeId: string
  ): Promise<ApiResponse<{ isSubmitted: boolean }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/homes/${homeId}/status`);
      return handleResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Failed to check home submission status");
    }
  },
};
