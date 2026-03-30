import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiResponse } from '../lib/api/client';

export interface UseApiListOptions {
    page?: number;
    limit?: number;
    search?: string;
    enabled?: boolean;
    [key: string]: any;
}

export function useApiList<T>(
    queryKey: string,
    fetchFn: (params: any) => Promise<ApiResponse<T[]>>,
    options: UseApiListOptions = {}
) {
    const { page = 1, limit = 10, search = '', enabled = true, ...rest } = options;

    return useQuery({
        queryKey: [queryKey, { page, limit, search, ...rest }],
        queryFn: () => fetchFn({ page, limit, search, ...rest }),
        enabled,
    });
}
