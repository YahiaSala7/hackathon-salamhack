import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
import {
  BudgetDistribution,
  RecommendationItem,
  Product,
} from "@/types/product";

interface SubmissionData {
  budgetDistribution: BudgetDistribution[];
  recommendations: Record<string, RecommendationItem[]>;
  products: Product[];
}

export function useSubmissionData() {
  const queryClient = useQueryClient();

  // Query for getting submission data
  const {
    data: submissionData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["submissionData"],
    queryFn: async () => {
      // Try to get from localStorage first
      const storedData = localStorage.getItem("submissionData");
      if (storedData) {
        return JSON.parse(storedData);
      }
      return null;
    },
    staleTime: Infinity, // Data won't go stale
    cacheTime: Infinity, // Cache won't expire
  });

  // Mutation for submitting form data
  const { mutate: submitForm, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.submitHomeData(formData);
      return response.data;
    },
    onSuccess: (data) => {
      // Store in localStorage
      localStorage.setItem("submissionData", JSON.stringify(data));

      // Update the query cache
      queryClient.setQueryData(["submissionData"], data);

      // Store in sessionStorage as backup
      sessionStorage.setItem("submissionData", JSON.stringify(data));

      // Dispatch custom event
      const event = new CustomEvent("submissionDataUpdated", { detail: data });
      window.dispatchEvent(event);
    },
  });

  return {
    submissionData,
    isLoading,
    error,
    submitForm,
    isPending,
  };
}
