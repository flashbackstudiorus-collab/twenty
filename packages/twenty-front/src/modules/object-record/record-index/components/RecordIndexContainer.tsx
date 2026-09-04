import { styled } from '@linaria/react';

import { RecordBoardContainer } from '@/object-record/record-board/components/RecordBoardContainer';
import { RecordIndexTableContainer } from '@/object-record/record-index/components/RecordIndexTableContainer';
import { recordIndexViewTypeState } from '@/object-record/record-index/states/recordIndexViewTypeState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';

import { RecordIndexCalendarContainer } from '@/object-record/record-index/components/RecordIndexCalendarContainer';
import { RecordIndexListContainer } from '@/object-record/record-index/components/RecordIndexListContainer';
import { RecordIndexEmptyStateNotShared } from '@/object-record/record-index/components/RecordIndexEmptyStateNotShared';
import { RecordIndexFiltersToContextStoreEffect } from '@/object-record/record-index/components/RecordIndexFiltersToContextStoreEffect';
import { useHasCurrentViewNonReadableFields } from '@/object-record/record-index/hooks/useHasCurrentViewNonReadableFields';
import { ViewType } from '@/views/types/ViewType';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: 100%;
`;

const StyledContainerWithPadding = styled.div`
  box-sizing: border-box;
  flex: 1;
  margin-left: ${themeCssVariables.spacing[2]};
  min-height: 0;
`;

const StyledTableCardWrapper = styled.div`
  background-color: ${themeCssVariables.background.primary};
  background-color: color-mix(in srgb, ${themeCssVariables.background.primary} 68%, transparent);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid ${themeCssVariables.border.color.light};
  border: 1px solid color-mix(in srgb, white 85%, transparent);
  border-radius: ${themeCssVariables.border.radius.xl};
  box-shadow:
    0px 20px 45px 0px rgba(15, 23, 42, 0.1),
    0px 2px 6px 0px rgba(15, 23, 42, 0.05),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.9),
    inset 0px 0px 0px 1px rgba(255, 255, 255, 0.25);
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]}
    ${themeCssVariables.spacing[4]};
  min-height: 0;
  overflow: hidden;
`;

export const RecordIndexContainer = () => {
  const recordIndexViewType = useAtomStateValue(recordIndexViewTypeState);

  const { recordIndexId, objectMetadataItem, objectNameSingular } =
    useRecordIndexContextOrThrow();

  const { hasCurrentViewNonReadableFields, nonReadableViewFieldInfo } =
    useHasCurrentViewNonReadableFields(objectMetadataItem);

  return (
    <StyledContainer>
      {hasCurrentViewNonReadableFields ? (
        <RecordIndexEmptyStateNotShared
          nonReadableViewFieldInfo={nonReadableViewFieldInfo}
        />
      ) : (
        <>
          <RecordIndexFiltersToContextStoreEffect />
          {recordIndexViewType === ViewType.TABLE && (
            <StyledTableCardWrapper>
              <RecordIndexTableContainer recordTableId={recordIndexId} />
            </StyledTableCardWrapper>
          )}
          {recordIndexViewType === ViewType.KANBAN && (
            <StyledContainerWithPadding>
              <RecordBoardContainer
                recordBoardId={recordIndexId}
                viewBarId={recordIndexId}
                objectNameSingular={objectNameSingular}
              />
            </StyledContainerWithPadding>
          )}
          {recordIndexViewType === ViewType.CALENDAR && (
            <StyledContainerWithPadding>
              <RecordIndexCalendarContainer
                recordCalendarInstanceId={recordIndexId}
                viewBarInstanceId={recordIndexId}
              />
            </StyledContainerWithPadding>
          )}
          {recordIndexViewType === ViewType.LIST && (
            <StyledContainerWithPadding>
              <RecordIndexListContainer
                recordListInstanceId={recordIndexId}
                viewBarInstanceId={recordIndexId}
              />
            </StyledContainerWithPadding>
          )}
        </>
      )}
    </StyledContainer>
  );
};
