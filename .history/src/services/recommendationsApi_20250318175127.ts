import { FormData } from "@/types/formData";
import { RecommendationsData } from "@/types/recommendations";
import { fetchApi } from "./api";

export const recommendationsApi = {
  getRecommendations: async (
    formData: FormData
  ): Promise<RecommendationsData> => {
    const response = await fetchApi<RecommendationsData>("/recommendations", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    return response.data;
  },
};
