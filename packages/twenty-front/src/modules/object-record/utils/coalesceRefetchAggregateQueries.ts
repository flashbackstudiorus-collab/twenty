import { type useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';

type ApolloCoreClient = ReturnType<typeof useApolloCoreClient>;

// useUpdateOneRecord (local mutation) and useTriggerOptimisticEffectFromSseUpdateEvents
// (SSE echo of that same mutation) both call this after the same record update, within
// milliseconds of each other. Coalescing concurrent calls onto one in-flight
// refetchQueries() promise per query-name set removes the duplicate network requests
// without changing when aggregates actually get refreshed.
const pendingAggregateRefetches = new Map<string, Promise<unknown>>();

export const coalesceRefetchAggregateQueries = ({
  apolloCoreClient,
  queryNames,
}: {
  apolloCoreClient: ApolloCoreClient;
  queryNames: string[];
}): Promise<unknown> => {
  const key = queryNames.join('|');

  const pendingRefetch = pendingAggregateRefetches.get(key);
  if (pendingRefetch !== undefined) {
    return pendingRefetch;
  }

  const refetchPromise = apolloCoreClient
    .refetchQueries({ include: queryNames })
    .finally(() => {
      pendingAggregateRefetches.delete(key);
    });

  pendingAggregateRefetches.set(key, refetchPromise);

  return refetchPromise;
};
