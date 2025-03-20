import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
import { toast } from "react-hot-toast";

export const useHomeSubmission = () => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const result = await api.submitHomeData(data);
      return result;
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
};
