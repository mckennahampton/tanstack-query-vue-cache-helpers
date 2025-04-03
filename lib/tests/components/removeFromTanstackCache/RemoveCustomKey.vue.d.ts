declare const _default: import("vue").DefineComponent<{}, {
    removeCustom: () => Promise<void>;
    helpers: {
        queryClient: import("@tanstack/vue-query").QueryClient;
        isQueryInitialized: () => boolean;
        addToCache: (options: import("../../../composables/useTanstackCacheHelpers/types").IAddToCache<{
            uuid: string;
            name: string;
        }>) => Promise<void>;
        updateItem: (options: import("../../../composables/useTanstackCacheHelpers/types").IUpdateItem<{
            uuid: string;
            name: string;
        }>) => Promise<void>;
        removeItem: (options: import("../../../composables/useTanstackCacheHelpers/types").IRemoveItem<{
            uuid: string;
            name: string;
        }>) => Promise<void>;
        clearCache: () => Promise<void>;
        refreshCache: (options: import("../../../composables/useTanstackCacheHelpers/types").IRefreshCache<{
            uuid: string;
            name: string;
        }>) => Promise<void>;
        refreshDeepItem: (options: import("../../../composables/useTanstackCacheHelpers/types").IRefreshDeepItem<{
            uuid: string;
            name: string;
        }>) => Promise<void>;
        removeDeepItem: (options: import("../../../composables/useTanstackCacheHelpers/types").IRemoveDeepItem<{
            uuid: string;
            name: string;
        }>) => Promise<void>;
        refreshPartialItem: <U>(options: import("../../../composables/useTanstackCacheHelpers/types").IRefreshPartialItem<{
            uuid: string;
            name: string;
        }, U>) => Promise<void>;
        removeSubItem: <U>(options: import("../../../composables/useTanstackCacheHelpers/types").IRemoveSubItem<{
            uuid: string;
            name: string;
        }, U>) => Promise<void>;
    };
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
