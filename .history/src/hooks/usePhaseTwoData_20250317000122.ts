import { useQuery } from "@tanstack/react-query";
import { phaseTwoApi } from "@/services/phaseTwoApi";
import { PhaseTwoData, previewData } from "@/types/phaseTwo";

export const usePhaseTwoData = (homeId?: string) => {
  return useQuery<PhaseTwoData>({
    queryKey: ["phaseTwoData", homeId],
    queryFn: async () => {
      if (!homeId) {
        return previewData;
      }
      const response = await phaseTwoApi.getPhaseTwoData(homeId);
      return response.data || previewData;
    },
    enabled: true, // Always enabled to show at least preview data
  });
};
