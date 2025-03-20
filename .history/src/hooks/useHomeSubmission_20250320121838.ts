import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
import { toast } from "react-hot-toast";

interface SubmissionResponse {
  success: boolean;
  data: {
    id: string;
    budgetDistribution: any[];
    recommendations: Record<string, any[]>;
    products: any[];
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
      // Store the data in localStorage
      if (response.data) {
        localStorage.setItem("submissionData", JSON.stringify(response.data));
      }
      // Invalidate and refetch the combined data query
      queryClient.invalidateQueries({ queryKey: ["combinedData"] });
      toast.success(response.message);
    },
    onError: (error: Error) => {
      console.error("Submission error:", error);
      toast.error(error.message);
    },
  });
};
