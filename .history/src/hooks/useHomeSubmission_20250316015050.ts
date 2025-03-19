import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
import { toast } from "react-hot-toast";

export const useHomeSubmission = () => {
  const mutation = useMutation({
    mutationFn: (data: FormData) => api.submitHomeData(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
