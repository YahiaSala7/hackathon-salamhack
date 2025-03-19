import { useQuery } from "@tanstack/react-query";
import { recommendationsApi } from "@/services/recommendationsApi";
import { FormData } from "@/types/formData";
import { fakeRecommendationsData } from "@/utils/fakeRecommendations";

export function useRecommendations(formData: FormData | null) {
  return useQuery({
    queryKey: ["recommendations", formData],
    queryFn: async () => {
      if (!formData) {
        return fakeRecommendationsData;
      }
      return recommendationsApi.getRecommendations(formData);
    },
    enabled: !!formData,
    gcTime: 30 * 60 * 1000, // 30 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
