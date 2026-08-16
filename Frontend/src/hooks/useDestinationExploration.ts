import { useQuery } from '@tanstack/react-query';
import { searchDestinationsApi, fetchDestinationDetailApi } from '../api/explore';

export function useDestinationSearchQuery(query: string, enabled = true) {
  return useQuery({
    queryKey: ['destination-search', query],
    queryFn: () => searchDestinationsApi(query),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDestinationDetailQuery(destinationName: string | null, enabled = true) {
  return useQuery({
    queryKey: ['destination-detail', destinationName],
    queryFn: () => fetchDestinationDetailApi(destinationName!),
    enabled: enabled && Boolean(destinationName),
    staleTime: 1000 * 60 * 10,
  });
}
