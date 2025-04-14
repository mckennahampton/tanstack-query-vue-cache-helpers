export interface RemoveArrayItemArgs<T> {
    array: T[],
    identityValues: number[] | string[],
    identityKey?: keyof T,
    findFn?: (item: T, target: any) => boolean
}
export const removeArrayItem = <T>({
    array,
    identityValues,
    identityKey ='id' as keyof T,
    findFn
}: RemoveArrayItemArgs<T>): T[] =>
{
    let index = findFn 
        ? array.findIndex(item => identityValues.some(id => findFn(item, id)))
        : array.findIndex(item => identityValues.some(id => id == item[identityKey]))

    if (index != -1)
    {
        array.splice(index, 1)
    }

    return array
}