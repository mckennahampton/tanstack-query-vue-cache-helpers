export interface RemoveArrayItemArgs<T> {
    array: T[],
    identityValues: number[] | string[],
    identityKey?: keyof T
}
export const removeArrayItem = <T>({
    array,
    identityValues,
    identityKey ='id' as keyof T
}: RemoveArrayItemArgs<T>): T[] =>
{
    let index = array.findIndex(item => identityValues.some(id => id == item[identityKey]))

    if (index != -1)
    {
        array.splice(index, 1)
    }

    return array
}