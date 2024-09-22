import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query"
import { TRPCClientError } from "@trpc/client"
import { toast } from "sonner"
import SuperJSON from "superjson"

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
      mutations: {
        onError(error) {
          if (error instanceof TRPCClientError) {
            toast.error(error.message)
          } else {
            toast.error(`Unexpected error: ${error.message}`)
          }
        },
      },
    },
  })
