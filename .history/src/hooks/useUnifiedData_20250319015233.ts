import { useQuery } from "@tanstack/react-query";
import { getUnifiedData } from "@/services/api";
import { FormData } from "@/types/formData";

export const useUnifiedData = (formData: FormData | null) => {
  return useQuery({
    queryKey: ["unifiedData", formData],
    queryFn: () => getUnifiedData(formData),
    enabled: !!formData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
