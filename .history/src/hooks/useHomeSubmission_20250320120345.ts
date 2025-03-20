import { useMutation } from "@tanstack/react-query";
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
  return useMutation<SubmissionResponse, Error, FormData>({
    mutationFn: async (data: FormData) => {
      console.log("Submitting form data:", data);
      const result = await api.submitHomeData(data);
      console.log("API Response:", result);
      return result;
    },
    onSuccess: (response) => {
      console.log("Submission successful with data:", response);
      toast.success(response.message);
    },
    onError: (error: Error) => {
      console.error("Submission error:", error);
      toast.error(error.message);
    },
  });
};
