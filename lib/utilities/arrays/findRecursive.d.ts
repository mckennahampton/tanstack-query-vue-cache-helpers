import { type MaybeRef } from 'vue';
/**
 * Recursively searches for a value in an array of objects.
 *
 * @template T - The type of objects in the array.
 * @template U - The type of the target value.
 * @param {T[]} arr - The array to search in.
 * @param {keyof T} targetKey - The key of the property to search for in each object.
 * @param {U} targetValue - The value to search for.
 * @param {keyof T} childKey - The key of the property that holds the child objects.
 * @return {T | null} The object with the target value, or null if not found.
 */
interface FindRecursiveArgs<T, U> {
    array: MaybeRef<T[]>;
    identityKey: keyof T;
    target: U;
    childKey: keyof T;
}
export declare function findRecursive<T, U>({ array, identityKey, target, childKey }: FindRecursiveArgs<T, U>): T | null;
export {};
