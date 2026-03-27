import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '../lib/api/client';

export function useApiDetail<T>(
    queryKey: string,
    id: string | number,
    fetchFn: (id: any) => Promise<ApiResponse<T>>,
    options: { enabled?: boolean } = {}
) {
    return useQuery({
        queryKey: [queryKey, id],
        queryFn: () => fetchFn(id),
        enabled: !!id && (options.enabled ?? true),
    });
}
