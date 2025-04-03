interface SubItem {
    id: number;
    name: string;
}
interface Item {
    id: number;
    name: string;
    subItems: SubItem[];
}
declare const _default: import("vue").DefineComponent<{}, {
    refreshPartialItem: () => Promise<void>;
    query: import("@tanstack/vue-query").UseQueryReturnType<never[], Error>;
    helpers: {
        queryClient: import("@tanstack/vue-query").QueryClient;
        isQueryInitialized: () => boolean;
        addToCache: (options: import("../../../composables/useTanstackCacheHelpers/types").IAddToCache<Item>) => Promise<void>;
        updateItem: (options: import("../../../composables/useTanstackCacheHelpers/types").IUpdateItem<Item>) => Promise<void>;
        removeItem: (options: import("../../../composables/useTanstackCacheHelpers/types").IRemoveItem<Item>) => Promise<void>;
        clearCache: () => Promise<void>;
        refreshCache: (options: import("../../../composables/useTanstackCacheHelpers/types").IRefreshCache<Item>) => Promise<void>;
        refreshDeepItem: (options: import("../../../composables/useTanstackCacheHelpers/types").IRefreshDeepItem<Item>) => Promise<void>;
        removeDeepItem: (options: import("../../../composables/useTanstackCacheHelpers/types").IRemoveDeepItem<Item>) => Promise<void>;
        refreshPartialItem: <U>(options: import("../../../composables/useTanstackCacheHelpers/types").IRefreshPartialItem<Item, U>) => Promise<void>;
        removeSubItem: <U>(options: import("../../../composables/useTanstackCacheHelpers/types").IRemoveSubItem<Item, U>) => Promise<void>;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
