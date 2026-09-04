import { getObjectMetadataIdentifierFields } from '@/object-metadata/utils/getObjectMetadataIdentifierFields';
import { ObjectRecordShowPageBreadcrumb } from '@/object-record/record-show/components/ObjectRecordShowPageBreadcrumb';
import { useRecordShowPagePagination } from '@/object-record/record-show/hooks/useRecordShowPagePagination';
import { PageCardHeader } from '@/ui/layout/page/components/PageCardHeader';
import { styled } from '@linaria/react';
import { useNavigate } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { getAppPath } from 'twenty-shared/utils';
import { IconChevronLeft } from 'twenty-ui/icon';
import { LightIconButton } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledBreadcrumbWithBack = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  min-width: 0;
`;

export const RecordShowPageHeader = ({
  objectNameSingular,
  objectRecordId,
  children,
}: {
  objectNameSingular: string;
  objectRecordId: string;
  children?: React.ReactNode;
}) => {
  const navigate = useNavigate();

  const { objectMetadataItem } = useRecordShowPagePagination(
    objectNameSingular,
    objectRecordId,
  );

  const { labelIdentifierFieldMetadataItem } =
    getObjectMetadataIdentifierFields({ objectMetadataItem });

  // amoCRM-style "back to the list" arrow: always returns to the object's
  // index page rather than history(-1), so it behaves the same whether the
  // record was opened from the list, a link, or a fresh tab.
  const handleBackToList = () => {
    navigate(
      getAppPath(AppPath.RecordIndexPage, {
        objectNamePlural: objectMetadataItem.namePlural,
      }),
    );
  };

  return (
    <PageCardHeader
      breadcrumb={
        <StyledBreadcrumbWithBack>
          <LightIconButton
            Icon={IconChevronLeft}
            size="small"
            accent="tertiary"
            onClick={handleBackToList}
            aria-label="Назад к списку"
          />
          <ObjectRecordShowPageBreadcrumb
            objectNameSingular={objectNameSingular}
            objectRecordId={objectRecordId}
            objectLabel={objectMetadataItem.labelPlural}
            labelIdentifierFieldMetadataItem={labelIdentifierFieldMetadataItem}
          />
        </StyledBreadcrumbWithBack>
      }
      actionButton={children}
    />
  );
};
