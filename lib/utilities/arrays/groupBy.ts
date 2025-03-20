type Grouped<T extends object> = { [key: string]: T[] }
interface GroupByArgs<T> {
    input: T[]
    key: string
}
export const groupBy = <T extends object>({ input, key }: GroupByArgs<T>): Grouped<T> => {
    return input.reduce((acc: Grouped<T>, currentItem: T) => {
        let groupKey = currentItem[key as keyof T] as unknown as string
        if (!acc[groupKey]) acc[groupKey] = []
        acc[groupKey].push(currentItem)
        return acc
    }, {} as Grouped<T>)
}