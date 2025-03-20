import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
import { toast } from "react-hot-toast";

export const useHomeSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const result = await api.submitHomeData(data);
      return result;
    },
    onSuccess: (response) => {
      toast.success(response.message);

      // Store response in React Query cache for future use
      queryClient.setQueryData(["planningData"], response);
    },
    onError: (error: Error) => {
      console.error("Submission Error:", error);
      toast.error(error.message);
    },
  });
};
