import { RecordChip } from '@/object-record/components/RecordChip';
import { useChipFieldDisplay } from '@/object-record/record-field/ui/meta-types/hooks/useChipFieldDisplay';
import { isDefined } from 'twenty-shared/utils';
import { ChipSize } from 'twenty-ui/data-display';

export const ChipFieldDisplay = () => {
  const {
    recordId,
    recordStore: recordValue,
    objectNameSingular,
    labelIdentifierLink,
    disableChipClick,
    maxWidth,
    triggerEvent,
    onRecordChipClick,
  } = useChipFieldDisplay();

  if (!isDefined(recordValue)) {
    // 2026-09-06: diagnostic for intermittent blank identifier chips in Auto-lab CRM
    // (recordStoreFamilyState not yet populated when this cell first mounts/re-renders).
    // Remove once the root cause is confirmed and fixed.
    // eslint-disable-next-line no-console
    console.warn('CHIP_EMPTY_DEBUG', {
      recordId,
      objectNameSingular,
      timestamp: Date.now(),
    });
    return null;
  }

  return (
    <RecordChip
      maxWidth={maxWidth}
      objectNameSingular={objectNameSingular}
      record={recordValue}
      size={ChipSize.Small}
      to={labelIdentifierLink}
      forceDisableClick={disableChipClick}
      triggerEvent={triggerEvent}
      onClick={onRecordChipClick}
    />
  );
};
