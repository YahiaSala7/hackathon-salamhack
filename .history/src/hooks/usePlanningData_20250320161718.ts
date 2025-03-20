import { useQuery } from "@tanstack/react-query";

export const usePlanningData = () => {
  return useQuery({
    queryKey: ["planningData"],
    staleTime: Infinity, // Cache forever unless manually invalidated
    enabled: false, // Prevents automatic refetching
  });
};
