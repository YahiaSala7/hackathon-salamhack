import { useQuery } from "@tanstack/react-query";
import { recommendationsApi } from "@/services/recommendationsApi";
import { FormData } from "@/types/formData";
import { RecommendationsData } from "@/types/recommendations";

export const useRecommendations = (formData: FormData | null) => {
  return useQuery<RecommendationsData, Error>({
    queryKey: ["recommendations", formData],
    queryFn: async () => {
      if (!formData) {
        throw new Error("Form data is required");
      }
      const response = await recommendationsApi.getRecommendations(formData);
      if (!response.data) {
        throw new Error("No data received from the server");
      }
      return response.data;
    },
    enabled: !!formData, // Only fetch when formData is available
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
  });
};
