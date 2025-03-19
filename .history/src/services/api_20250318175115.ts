import { FormData } from "@/types/formData";
import { ApiResponse } from "@/types/api";

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

// API Error Type
export class ApiError extends Error {
  constructor(public status: number, message: string) {
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
      errorData.message || "An error occurred"
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
};

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, "API request failed");
  }

  return response.json();
}
