import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { getGroupByAggregateQueryName } from '@/object-record/record-aggregate/utils/getGroupByAggregateQueryName';
import { coalesceRefetchAggregateQueries } from '@/object-record/utils/coalesceRefetchAggregateQueries';
import { getAggregateQueryName } from '@/object-record/utils/getAggregateQueryName';

export const useRefetchAggregateQueries = () => {
  const apolloCoreClient = useApolloCoreClient();

  const refetchAggregateQueries = async ({
    objectMetadataNamePlural,
  }: {
    objectMetadataNamePlural: string;
  }) => {
    const queryName = getAggregateQueryName(objectMetadataNamePlural);

    const groupByAggregateQueryName = getGroupByAggregateQueryName({
      objectMetadataNamePlural,
    });

    await coalesceRefetchAggregateQueries({
      apolloCoreClient,
      queryNames: [queryName, groupByAggregateQueryName],
    });
  };

  return {
    refetchAggregateQueries,
  };
};
