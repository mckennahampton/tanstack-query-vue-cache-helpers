export interface IAddToCache<T> {
    item: T,
    placement?: 'start' | 'back'
}

export interface IUpdateItem<T> {
    item: T,
    identityKey: keyof T
}

export interface IFrameworkAdapter {
    nextTick: () => Promise<void>
}

export interface IRefreshCache<T> {
    items: T[],
    identityKey?: keyof T,
    newItemsLocation?: 'front' | 'back'
} 