import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useHomeSubmission = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const result = await api.submitHomeData(data);
      return result;
    },
    onSuccess: (response) => {
      toast.success(response.message);
      if (response.data?.id) {
        router.push(`/phase-two/${response.data.id}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
