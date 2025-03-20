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

  return useMutation({
    mutationFn: (data: FormData) => api.submitHomeData(data),
    onSuccess: (response, data) => {
      // Store the response data in the cache
      queryClient.setQueryData(["homeData", response.data.id], response.data);

      // Store form data separately
      queryClient.setQueryData(["formData", response.data.id], data);

      toast.success("Form submitted successfully!");
    },
    onError: (error: any) => {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit form");
    },
  });
};
