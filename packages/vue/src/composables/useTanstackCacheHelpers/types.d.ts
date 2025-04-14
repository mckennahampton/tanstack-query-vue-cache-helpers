export interface IAddToCache<T> {
    item: T;
    placement?: 'start' | 'back';
}
export interface IUpdateItem<T> {
    item: T;
    identityKey?: keyof T;
}
export interface IRemoveItem<T> {
    target: number | number[] | string | string[];
    identityKey?: keyof T;
}
export interface IRefreshCache<T> {
    items: T[];
    identityKey?: keyof T;
    newItemsLocation?: 'front' | 'back';
}
export interface IRefreshDeepItem<T> {
    item: T;
    childKey: keyof T;
    parentKey: keyof T;
    identityKey?: keyof T;
    findFn?: (cacheItem: T, newItem: T) => boolean;
}
export interface IRemoveDeepItem<T> {
    targetKeyValue: T | number;
    childKey: keyof T;
    parentKey: keyof T;
    identityKey?: keyof T;
}
export interface IRemoveSubItem<T, U> {
    targetKeyValue: string | number;
    identityKey?: keyof T;
    subItemsKey: keyof T;
    removalKeyValue: U[keyof U];
    removalKey?: keyof U;
}
export interface IRefreshPartialItem<T, U> {
    targetKeyValue: string | number;
    identityKey?: keyof T;
    updateKey: keyof T;
    updatedContent: U;
    updatedItemsIdentityKey?: keyof U;
    treatArrayAsObject?: boolean;
    debug?: boolean;
}
