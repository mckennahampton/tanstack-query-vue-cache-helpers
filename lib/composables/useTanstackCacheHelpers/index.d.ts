import { type QueryKey } from "@tanstack/vue-query";
import type { IAddToCache, IUpdateItem, IRemoveItem, IRefreshCache, IRefreshDeepItem, IRemoveDeepItem, IRemoveSubItem, IRefreshPartialItem } from "./types";
export declare const useTanstackCacheHelpers: <T extends object, TTaggedQueryKey extends QueryKey = readonly unknown[]>(queryKey: TTaggedQueryKey) => {
    queryClient: import("@tanstack/vue-query").QueryClient;
    isQueryInitialized: () => boolean;
    addToCache: (options: IAddToCache<T>) => Promise<void>;
    updateItem: (options: IUpdateItem<T>) => Promise<void>;
    removeItem: (options: IRemoveItem<T>) => Promise<void>;
    clearCache: () => Promise<void>;
    refreshCache: (options: IRefreshCache<T>) => Promise<void>;
    refreshDeepItem: (options: IRefreshDeepItem<T>) => Promise<void>;
    removeDeepItem: (options: IRemoveDeepItem<T>) => Promise<void>;
    refreshPartialItem: <U>(options: IRefreshPartialItem<T, U>) => Promise<void>;
    removeSubItem: <U>(options: IRemoveSubItem<T, U>) => Promise<void>;
};
