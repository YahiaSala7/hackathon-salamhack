import { useQuery } from "@tanstack/react-query";
import { combinedApi } from "@/services/combinedApi";

export const useCombinedData = () => {
  return useQuery({
    queryKey: ["combinedData"],
    queryFn: combinedApi.getCombinedData,
  });
};
