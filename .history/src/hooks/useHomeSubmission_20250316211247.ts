import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { FormData } from "@/types/formData";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useHomeSubmission = () => {
  const router = useRouter();
  console.log("Initializing useHomeSubmission hook");

  return useMutation({
    mutationFn: async (data: FormData) => {
      console.log("Mutation function called with data:", data);
      const result = await api.submitHomeData(data);
      console.log("Mutation result:", result);
      return result;
    },
    onSuccess: (response) => {
      console.log("Mutation success:", response);
      toast.success(response.message);
      if (response.data?.id) {
        router.push(`/phase-two/${response.data.id}`);
      }
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast.error(error.message);
    },
  });
};
