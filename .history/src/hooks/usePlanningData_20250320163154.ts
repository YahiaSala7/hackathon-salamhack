import { useQuery, useQueryClient } from "@tanstack/react-query";

export const usePlanningData = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(["planningData"]);
};
