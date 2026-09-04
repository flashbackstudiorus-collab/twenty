import { DRAG_SOURCE_OPACITY } from '@/ui/utilities/drag-and-drop/constants/DragSourceOpacity';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledBoardCard = styled.div<{
  isDragging?: boolean;
}>`
  --record-card-background-color: ${themeCssVariables.background.secondary};

  background-color: var(--record-card-background-color);
  background-color: color-mix(in srgb, var(--record-card-background-color) 40%, transparent);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid ${themeCssVariables.border.color.light};
  border: 1px solid color-mix(in srgb, white 85%, transparent);
  border-radius: ${themeCssVariables.border.radius.xl};
  box-shadow:
    0px 20px 45px 0px rgba(15, 23, 42, 0.1),
    0px 2px 6px 0px rgba(15, 23, 42, 0.05),
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.9),
    inset 0px 0px 0px 1px rgba(255, 255, 255, 0.25);
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  opacity: ${({ isDragging }) => (isDragging ? DRAG_SOURCE_OPACITY : 1)};
  transition: box-shadow 160ms ease, transform 160ms ease, border-color 160ms ease;

  width: 100%;

  &[data-selected='true'] {
    --record-card-background-color: ${themeCssVariables.accent.quaternary};
  }

  &[data-focused='true'] {
    --record-card-background-color: ${themeCssVariables.background.tertiary};
  }

  &[data-active='true'] {
    --record-card-background-color: ${themeCssVariables.accent.quaternary};

    border: 1px solid ${themeCssVariables.color.blue7};
  }

  &:hover {
    border: 1px solid ${themeCssVariables.border.color.strong};
    border: 1px solid color-mix(in srgb, white 85%, transparent);
    box-shadow:
      0px 26px 55px 0px rgba(15, 23, 42, 0.16),
      0px 4px 10px 0px rgba(15, 23, 42, 0.08),
      inset 0px 1px 0px 0px rgba(255, 255, 255, 0.9),
      inset 0px 0px 0px 1px rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);

    &[data-active='true'] {
      border: 1px solid ${themeCssVariables.color.blue7};
    }
  }

  .checkbox-container {
    flex-shrink: 0;
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    transition: all ease-in-out 160ms;
  }

  &[data-selected='true'] .checkbox-container,
  &:hover .checkbox-container {
    max-width: ${themeCssVariables.spacing[6]};
    opacity: 1;
    pointer-events: auto;
  }

  .compact-icon-container {
    opacity: 0;
    transition: all ease-in-out 160ms;
  }
  &:hover .compact-icon-container {
    opacity: 1;
  }
`;

export { StyledBoardCard as RecordCard };
