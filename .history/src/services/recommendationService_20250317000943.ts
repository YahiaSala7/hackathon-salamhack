import { RecommendationData } from "@/types/recommendation";

export const fetchRecommendations = async (
  userId: string
): Promise<RecommendationData> => {
  const response = await fetch(`/api/recommendations/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }
  return response.json();
};
