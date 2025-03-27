import { ref, unref, type Ref } from "vue"
import { useMutation, type UseMutationReturnType } from "@tanstack/vue-query"

/**
 * This removes the need for a bunch of boilerplate code to handle an async confirmation prompt
 * effectively. With this there is no need to catch errors on the implementation side and
 * no need to track progress with your own loading refs
 */
const CANCELLED_MUTATION = Symbol('CANCELLED_MUTATION')

// Extract all parameters of the original useMutation function
type UseMutationParams<TData, TError, TVariables, TContext> = Parameters<typeof useMutation<TData, TError, TVariables, TContext>>;

// Create a wrapper function that preserves the exact parameter types
export const useMutationFactory = <
    TData = unknown, 
    TError = Error, 
    TVariables = void, 
    TContext = unknown,
>(
  confirm: (data: TVariables, loading: Ref<boolean>) => Promise<boolean>,
  ...args: [...UseMutationParams<TData, TError, TVariables, TContext>]
): UseMutationReturnType<TData, TError, TVariables, TContext> => {

    const [mutationOptions, queryClient] = args;

    // Create a new mutation options object with injected logic
  const enhancedMutationOptions = {
        ...mutationOptions,
        mutationFn: async (data: TVariables) => {
            const loading = ref(false);

            // If confirmation is required and denied, return early
            if (confirm) {
                if (!(await confirm(data, loading))) {
                    return CANCELLED_MUTATION as unknown as TData;
                }
            }

            // Ensure the original mutationFn exists before calling
            if (unref(mutationOptions).mutationFn == undefined || unref(unref(mutationOptions).mutationFn) == undefined) {
                throw new Error('No mutation function provided');
            }

            else {
                return unref(unref(mutationOptions).mutationFn)!(data).finally(() => loading.value = false)
                // try {
                //     loading.value = true;
                //     const result = await unref(unref(mutationOptions).mutationFn)!(data)
                //     return result;
                // } finally {
                //     loading.value = false;
                // }
            }
        },
        onSuccess: (data: TData, variables: TVariables, context: TContext) => {
            // Prevent calling onSuccessFn if the mutation was cancelled
            if (data === CANCELLED_MUTATION) return;

            // Call the original onSuccess if it exists
            unref(unref(mutationOptions).onSuccess)?.(data, variables, context);
        }
    };

    // Call the original useMutation with enhanced options
    return useMutation<TData, TError, TVariables, TContext>(
        enhancedMutationOptions, 
        queryClient
    );
}


// Create a wrapper function that preserves the exact generic types
// export const useMutationFactory = <
//   TData = unknown, 
//   TError = Error, 
//   TVariables = void, 
//   TContext = unknown,
// >(
//   mutationOptions: UseMutationOptions<TData, TError, TVariables, TContext>,
//   queryClient?: QueryClient,
//   confirm?: (data: TVariables, loading: Ref<boolean>) => Promise<boolean>,
// ): UseMutationReturnType<TData, TError, TVariables, TContext> => {

//   return useMutation<TData, TError, TVariables, TContext>(
//     {
//         ...(mutationOptions.mutationFn && {
//             mutationFn: async(data) => {
//                 const loading = ref(false)
    
//                 // If confirmation is required and denied, return early without throwing an error
//                 if (confirm) {
//                     if (!(await confirm(data, loading))) {
//                         return CANCELLED_MUTATION as unknown as TData; 
//                     }
//                 }
    
//                 loading.value = true;
//                 return mutationOptions.mutationFn!(data).finally(() => loading.value = false)
//             },
//         }),
//         ...(mutationOptions.onSuccess && {
//             onSuccess: (data, variables, context) => {
//                 // Prevent calling onSuccessFn if the mutation was cancelled
//                 if (data === CANCELLED_MUTATION) return;
    
//                 mutationOptions.onSuccess!(data, variables, context);
//             },
//         }),
//         ...mutationOptions
//     },
//     queryClient);
// }