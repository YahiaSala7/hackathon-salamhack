import { useQuery } from "@tanstack/react-query";
import { combinedApi } from "@/services/combinedApi";
import { CombinedData } from "@/types/combinedData";

export const useCombinedData = () => {
  return useQuery<CombinedData, Error>({
    queryKey: ["combinedData"],
    queryFn: combinedApi.getAllData,
  });
};
