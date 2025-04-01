declare const _default: import("vue").DefineComponent<{}, {
    removeItem: () => Promise<void>;
    helpers: {
        queryClient: import("@tanstack/vue-query").QueryClient;
        isQueryInitialized: () => boolean;
        addToCache: (options: import("../../../composables/useTanstackCacheHelpers/types").IAddToCache<object>) => Promise<void>;
        updateItem: (options: import("../../../composables/useTanstackCacheHelpers/types").IUpdateItem<object>) => Promise<void>;
        removeItem: (options: import("../../../composables/useTanstackCacheHelpers/types").IRemoveItem<object>) => Promise<void>;
        clearCache: () => Promise<void>;
        refreshCache: (options: import("../../../composables/useTanstackCacheHelpers/types").IRefreshCache<object>) => Promise<void>;
        refreshDeepItem: (options: import("../../../composables/useTanstackCacheHelpers/types").IRefreshDeepItem<object>) => Promise<void>;
        removeDeepItem: (options: import("../../../composables/useTanstackCacheHelpers/types").IRemoveDeepItem<object>) => Promise<void>;
        refreshPartialItem: <U>(options: import("../../../composables/useTanstackCacheHelpers/types").IRefreshPartialItem<object, U>) => Promise<void>;
        removeSubItem: <U>(options: import("../../../composables/useTanstackCacheHelpers/types").IRemoveSubItem<object, U>) => Promise<void>;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
