import { type MaybeRef } from 'vue';
interface InsertDeepItemArgs<T> {
    array: MaybeRef<T[]>;
    item: T;
    childKey: keyof T;
    parentKey: keyof T;
    identityKey?: keyof T;
}
export declare const insertDeepItem: <T>({ array, item, childKey, parentKey, identityKey }: InsertDeepItemArgs<T>) => void;
export {};
