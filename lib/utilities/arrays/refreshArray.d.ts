import { type MaybeRef } from 'vue';
/**
 * @description
 * Refresh an array of objects with a new set of objects based on the identity key.
 *
 * Any items in the newItems array that have the same value for the identity key will
 * be updated in the array array.
 *
 * Any items in the newItems array that are not in the array array will be appended
 * to the front of the array array.
 *
 * Optionally, you can completely replace the array array with the newItems array by
 * setting the truncate parameter to true.
 *
 * @param array
 * @param newItems
 * @param truncate
 * @param identityKey
 * @param newItemsLocation
 * @returns
 */
interface RefreshArrayArgs<T> {
    array: MaybeRef<T[]> | T[];
    newItems: MaybeRef<T[]> | T[];
    truncate?: boolean;
    identityKey?: keyof T;
    newItemsLocation?: 'front' | 'back';
    debug?: boolean;
}
export declare const refreshArray: <T>({ array, newItems, truncate, identityKey, newItemsLocation, }: RefreshArrayArgs<T>) => MaybeRef<T[]>;
export {};
