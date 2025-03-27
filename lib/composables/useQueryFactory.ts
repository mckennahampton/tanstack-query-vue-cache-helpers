import { unref, toValue } from "vue"
import { usePage } from "@inertiajs/vue3"
import { type MaybeRefDeep } from "../../node_modules/@tanstack/vue-query/build/modern/types"
import {
    type InitialDataFunction,
    type QueryKey,
    useQuery,
    type UseQueryReturnType
} from "@tanstack/vue-query"

// Extract all parameters of the original useMutation function
type UseQueryParams<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = Parameters<typeof useQuery<TQueryFnData, TError, TData, TQueryKey>>;
export const useQueryFactory = <
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(
    useInitialData: boolean = false,
    ...args: [...UseQueryParams<TQueryFnData, TError, TData, TQueryKey>]
): UseQueryReturnType<TData, TError> => {

    const [options, queryClient] = args;
    const initialData = useInitialData ? usePage().props[JSON.stringify(toValue(options).queryKey)] as MaybeRefDeep<TQueryFnData | InitialDataFunction<TQueryFnData>> : false
    return useQuery(
        {
            ...options,
            ...(initialData && {
                initialData: unref(initialData),
                initialDataUpdatedAt: Date.now(),
            }),
        },
        queryClient
    )
}
/**
 * I was using the same code over and over so this just helps reduce the boiletplate a little.
 * This will pickup any init props the page has and instantiate the cache with it if it exists.
 */
  
// export const queryFactory = <
//     TQueryFnData = unknown,
//     TError = DefaultError,
//     TData = TQueryFnData,
//     TQueryKey extends QueryKey = QueryKey>(
//         options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
//         useInitialData: boolean = false
// ) => {
//     const initialData = useInitialData ? usePage().props[JSON.stringify(toValue(options).queryKey)] as MaybeRefDeep<TQueryFnData | InitialDataFunction<TQueryFnData>> : false
//     return useQuery({
//         ...options,
//         ...(initialData && {
//             initialData: unref(initialData),
//             initialDataUpdatedAt: Date.now(),
//         }),
//     })
// }