import { ApiResponse } from "./api";
import { PhaseTwoData } from "@/types/phaseTwo";

export const phaseTwoApi = {
  getPhaseTwoData: async (
    homeId: string
  ): Promise<ApiResponse<PhaseTwoData>> => {
    try {
      const response = await fetch(`/api/phase-two/${homeId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch phase two data");
      }
      return response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch phase two data"
      );
    }
  },
};
