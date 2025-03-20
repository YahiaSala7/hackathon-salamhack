import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
import { toast } from "react-hot-toast";
import {
  BudgetDistribution,
  RecommendationItem,
  Product,
} from "@/types/product";

interface SubmissionResponse {
  success: boolean;
  data: {
    id: string;
    budgetDistribution: BudgetDistribution[];
    recommendations: Record<string, RecommendationItem[]>;
    products: Product[];
  };
  message: string;
}

export const useHomeSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation<SubmissionResponse, Error, FormData>({
    mutationFn: async (data: FormData) => {
      console.log("Submitting form data:", data);
      const result = await api.submitHomeData(data);
      console.log("API Response:", result);
      return result;
    },
    onSuccess: (response) => {
      console.log("Submission successful with data:", response);

      if (response.data) {
        // Store the data in localStorage for persistence
        localStorage.setItem("submissionData", JSON.stringify(response.data));

        // Set the data in the React Query cache
        queryClient.setQueryData(["combinedData"], response.data);

        // Set individual data in the cache for specific queries
        queryClient.setQueryData(
          ["recommendations"],
          response.data.recommendations
        );
        queryClient.setQueryData(["products"], response.data.products);
        queryClient.setQueryData(
          ["budgetDistribution"],
          response.data.budgetDistribution
        );
      }

      toast.success(response.message);
    },
    onError: (error: Error) => {
      console.error("Submission error:", error);
      toast.error(error.message);
    },
  });
};
