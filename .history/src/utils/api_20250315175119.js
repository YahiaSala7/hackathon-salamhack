import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Global request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., 401 unauthorized, etc.)
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      console.error("Unauthorized access");
      // You might want to redirect to login or clear tokens
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error) => {
  const errorMessage =
    error.response?.data?.message || error.message || "An error occurred";
  console.error("API Error:", errorMessage);
  return Promise.reject(errorMessage);
};

/**
 * Custom hook for GET requests
 * @param {string} url - API endpoint
 * @param {Object} options - Additional options for react-query and axios
 * @returns {Object} - React Query result object
 */
export const useFetchData = (url, options = {}) => {
  const {
    queryKey = [url],
    enabled = true,
    refetchOnWindowFocus = false,
    retry = 1,
    axiosOptions = {},
    ...restOptions
  } = options;

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(url, axiosOptions);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },
    enabled,
    refetchOnWindowFocus,
    retry,
    ...restOptions,
  });
};

/**
 * Custom hook for POST requests
 * @param {string} url - API endpoint
 * @param {Object} options - Additional options for react-query and axios
 * @returns {Object} - React Query mutation result object
 */
export const usePostData = (url, options = {}) => {
  const queryClient = useQueryClient();
  const { invalidateQueries = [], axiosOptions = {}, ...restOptions } = options;

  return useMutation({
    mutationFn: async (data) => {
      try {
        const response = await axiosInstance.post(url, data, axiosOptions);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },
    onSuccess: () => {
      // Invalidate queries after successful mutation
      invalidateQueries.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: query });
      });
    },
    ...restOptions,
  });
};

/**
 * Custom hook for PUT requests
 * @param {string} url - API endpoint
 * @param {Object} options - Additional options for react-query and axios
 * @returns {Object} - React Query mutation result object
 */
export const usePutData = (url, options = {}) => {
  const queryClient = useQueryClient();
  const { invalidateQueries = [], axiosOptions = {}, ...restOptions } = options;

  return useMutation({
    mutationFn: async (data) => {
      try {
        const response = await axiosInstance.put(url, data, axiosOptions);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },
    onSuccess: () => {
      // Invalidate queries after successful mutation
      invalidateQueries.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: query });
      });
    },
    ...restOptions,
  });
};

/**
 * Custom hook for PATCH requests
 * @param {string} url - API endpoint
 * @param {Object} options - Additional options for react-query and axios
 * @returns {Object} - React Query mutation result object
 */
export const useUpdateData = (url, options = {}) => {
  const queryClient = useQueryClient();
  const { invalidateQueries = [], axiosOptions = {}, ...restOptions } = options;

  return useMutation({
    mutationFn: async (data) => {
      try {
        const response = await axiosInstance.patch(url, data, axiosOptions);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },
    onSuccess: () => {
      // Invalidate queries after successful mutation
      invalidateQueries.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: query });
      });
    },
    ...restOptions,
  });
};

/**
 * Custom hook for DELETE requests
 * @param {string} url - API endpoint
 * @param {Object} options - Additional options for react-query and axios
 * @returns {Object} - React Query mutation result object
 */
export const useDeleteData = (url, options = {}) => {
  const queryClient = useQueryClient();
  const { invalidateQueries = [], axiosOptions = {}, ...restOptions } = options;

  return useMutation({
    mutationFn: async (id) => {
      try {
        const endpoint = id ? `${url}/${id}` : url;
        const response = await axiosInstance.delete(endpoint, axiosOptions);
        return response.data;
      } catch (error) {
        return handleApiError(error);
      }
    },
    onSuccess: () => {
      // Invalidate queries after successful mutation
      invalidateQueries.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: query });
      });
    },
    ...restOptions,
  });
};

// Direct API functions (non-hook versions)
export const fetchData = async (url, options = {}) => {
  try {
    const response = await axiosInstance.get(url, options);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const postData = async (url, data, options = {}) => {
  try {
    const response = await axiosInstance.post(url, data, options);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const putData = async (url, data, options = {}) => {
  try {
    const response = await axiosInstance.put(url, data, options);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateData = async (url, data, options = {}) => {
  try {
    const response = await axiosInstance.patch(url, data, options);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteData = async (url, options = {}) => {
  try {
    const response = await axiosInstance.delete(url, options);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Export the axios instance for advanced use cases
export { axiosInstance };
