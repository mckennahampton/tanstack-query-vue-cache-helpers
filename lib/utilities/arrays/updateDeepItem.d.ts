import { type MaybeRef } from 'vue';
interface UpdateDeepItemArgs<T> {
    array: MaybeRef<T[]>;
    item: T;
    childKey: keyof T;
    parentKey: keyof T;
    identityKey?: keyof T;
}
export declare const updateDeepItem: <T>({ array, item, childKey, parentKey, identityKey }: UpdateDeepItemArgs<T>) => void;
export {};
