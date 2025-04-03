import { type QueryKey, type QueryClient } from "@tanstack/query-core";
import { type IAddToCache } from "../composables/useTanstackCacheHelpers/types";
export declare const addToCache: <T extends object>(queryClient: QueryClient, queryKey: QueryKey, { item, placement }: IAddToCache<T>, frameworkAdapter: {
    nextTick: () => Promise<void>;
}) => Promise<void>;
