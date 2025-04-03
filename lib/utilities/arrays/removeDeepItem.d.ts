import { type MaybeRef } from 'vue';
export interface RemoveDeepItemArgs<T> {
    array: MaybeRef<T[]>;
    oldItem: T | number;
    childKey: keyof T;
    parentKey: keyof T;
    identityKey?: keyof T;
}
export declare const removeDeepItem: <T>({ array, oldItem, childKey, parentKey, identityKey }: RemoveDeepItemArgs<T>) => void;
