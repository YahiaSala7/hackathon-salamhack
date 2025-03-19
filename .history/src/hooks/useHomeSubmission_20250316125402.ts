import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useHomeSubmission = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: FormData) => api.submitHomeData(data),
    onSuccess: (response) => {
      toast.success(response.message);
      // You can redirect to the next phase or show the created home
      if (response.data?.id) {
        router.push(`/phase-two/${response.data.id}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
