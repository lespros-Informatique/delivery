import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponse } from '../lib/api/client';

export function useApiMutation<TVariables, TData = any>(
    mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
    options: {
        onSuccess?: (data: ApiResponse<TData>, variables: TVariables) => void;
        onError?: (error: any) => void;
        invalidateKeys?: string[];
    } = {}
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: (data, variables) => {
            if (options.invalidateKeys) {
                options.invalidateKeys.forEach((key) => {
                    queryClient.invalidateQueries({ queryKey: [key] });
                });
            }
            if (options.onSuccess) {
                options.onSuccess(data, variables);
            }
        },
        onError: options.onError,
    });
}
