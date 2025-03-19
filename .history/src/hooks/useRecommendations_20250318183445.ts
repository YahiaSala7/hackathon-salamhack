import { useQuery } from "@tanstack/react-query";
import { recommendationsApi } from "@/services/recommendationsApi";
import { RecommendationsData } from "@/types/recommendations";

export const useRecommendations = () => {
  return useQuery<RecommendationsData, Error>({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const response = await recommendationsApi.getRecommendations();
      if (!response.data) {
        throw new Error("No data received from the server");
      }
      return response.data;
    },
    gcTime: 30 * 60 * 1000, // Keep data in garbage collection for 30 minutes
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};
