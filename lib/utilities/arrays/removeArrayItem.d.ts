import { type MaybeRef } from 'vue';
export interface RemoveArrayItemArgs<T> {
    array: MaybeRef<T[]>;
    identityValues: number[] | string[];
    identityKey?: keyof T;
}
export declare const removeArrayItem: <T>({ array, identityValues, identityKey }: RemoveArrayItemArgs<T>) => MaybeRef<T[]>;
