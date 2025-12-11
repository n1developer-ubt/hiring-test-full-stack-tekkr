import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../client"
import { ModelInfo } from "../types"

export const modelKeys = {
   all: ["models"] as const,
}

export function useModelsQuery() {
   return useQuery({
      queryKey: modelKeys.all,
      queryFn: async () => {
         const response = await apiClient.get<ModelInfo[]>("/models")
         return response.data
      },
      staleTime: 1000 * 60 * 5,
   })
}
