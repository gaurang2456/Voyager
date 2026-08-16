import { useQuery } from '@tanstack/react-query';
import { searchDestinationsApi, fetchDestinationDetailApi } from '../api/explore';

export function useDestinationSearchQuery(query: string, enabled = true) {
  return useQuery({
    queryKey: ['destinationSearch', query],
    queryFn: () => searchDestinationsApi(query),
    enabled: enabled && Boolean(query.trim()),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDestinationDetailQuery(name: string) {
  return useQuery({
    queryKey: ['destinationDetail', name],
    queryFn: () => fetchDestinationDetailApi(name),
    enabled: Boolean(name),
    staleTime: 1000 * 60 * 10,
  });
}
