import { useQuery } from "@tanstack/react-query";
import { recommendationsApi } from "@/services/recommendationsApi";
import { RecommendationsData } from "@/types/recommendations";

export const useRecommendations = () => {
  return useQuery<RecommendationsData, Error>({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const response = await recommendationsApi.getRecommendations();
      return response.data;
    },
    enabled: false, // Don't fetch automatically
  });
};
