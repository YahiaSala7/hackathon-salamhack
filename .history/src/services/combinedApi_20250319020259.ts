import { api } from "./api";
import { CombinedData } from "@/types/combinedData";

export const combinedApi = {
  getAllData: async (): Promise<CombinedData> => {
    const response = await api.get("/combined-data");
    return response.data;
  },
};
