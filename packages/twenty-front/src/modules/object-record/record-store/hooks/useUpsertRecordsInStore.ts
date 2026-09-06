import { filterRecordOnGqlFields } from '@/object-record/cache/utils/filterRecordOnGqlFields';
import { type RecordGqlFields } from '@/object-record/graphql/record-gql-fields/types/RecordGqlFields';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { useCallback } from 'react';
import { useStore } from 'jotai';
import { isDefined } from 'twenty-shared/utils';
import { isDeeplyEqual } from '~/utils/isDeeplyEqual';

type UpsertRecordsInStoreProps = {
  partialRecords: ObjectRecord[];
  recordGqlFields?: RecordGqlFields;
};

export const useUpsertRecordsInStore = () => {
  const store = useStore();

  const upsertRecordsInStore = useCallback(
    ({ partialRecords, recordGqlFields }: UpsertRecordsInStoreProps) => {
      for (const partialRecord of partialRecords) {
        try {
          const currentRecord = store.get(
            recordStoreFamilyState.atomFamily(partialRecord.id),
          );

          const filteredPartialRecord = isDefined(recordGqlFields)
            ? filterRecordOnGqlFields({
                record: partialRecord,
                recordGqlFields,
              })
            : partialRecord;

          if (!isDefined(currentRecord)) {
            const newRecord = {
              id: partialRecord.id,
              __typename: partialRecord.__typename,
              ...filteredPartialRecord,
            };
            store.set(
              recordStoreFamilyState.atomFamily(partialRecord.id),
              newRecord,
            );
            continue;
          }

          const filteredCurrentRecord = isDefined(recordGqlFields)
            ? filterRecordOnGqlFields({
                record: currentRecord,
                recordGqlFields,
              })
            : currentRecord;

          if (!isDeeplyEqual(filteredCurrentRecord, filteredPartialRecord)) {
            const updatedRecord = {
              ...currentRecord,
              ...filteredPartialRecord,
            };
            store.set(
              recordStoreFamilyState.atomFamily(partialRecord.id),
              updatedRecord,
            );
          }
        } catch (error) {
          // 2026-09-06: one malformed record used to abort the whole loop, leaving every
          // record after it in this batch permanently missing from the store (blank chip
          // cells with no console error, since the thrown error was never logged). Log and
          // keep going so the rest of the batch still renders.
          // eslint-disable-next-line no-console
          console.error('UPSERT_RECORD_IN_STORE_FAILED', {
            recordId: partialRecord?.id,
            error,
          });
        }
      }
    },
    [store],
  );

  return {
    upsertRecordsInStore,
  };
};
