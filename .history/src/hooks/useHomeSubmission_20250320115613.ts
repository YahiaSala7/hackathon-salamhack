import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
import { toast } from "react-hot-toast";

interface SubmissionResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    budgetDistribution: any[];
    recommendations: Record<string, any[]>;
    products: any[];
  };
}

export const useHomeSubmission = () => {
  return useMutation<SubmissionResponse, Error, FormData>({
    mutationFn: async (data: FormData) => {
      console.log("Submitting form data:", data);
      const result = await api.submitHomeData(data);
      console.log("API Response:", result);

      if (!result.success || !result.data) {
        throw new Error(result.message || "Failed to submit form");
      }

      // Transform the response to match our expected structure
      const transformedResponse: SubmissionResponse = {
        success: result.success,
        message: result.message,
        data: {
          id: result.data.id,
          budgetDistribution: result.data.budgetDistribution || [],
          recommendations: result.data.recommendations || {},
          products: result.data.products || [],
        },
      };

      console.log("Transformed Response:", transformedResponse);
      return transformedResponse;
    },
    onSuccess: (response) => {
      console.log("Submission successful with data:", response);
      // Store the data in localStorage
      if (response.data) {
        localStorage.setItem("submissionData", JSON.stringify(response.data));
      }
      toast.success(response.message);
    },
    onError: (error: Error) => {
      console.error("Submission error:", error);
      toast.error(error.message);
    },
  });
};
