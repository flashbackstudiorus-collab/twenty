import { cx } from '@linaria/core';
import { styled } from '@linaria/react';
import { type ReactNode, useContext } from 'react';
import { ThemeContext } from 'twenty-ui/theme-constants';

export const StyledCell = styled.div<{
  backgroundColor: string;
  borderColor: string;
  isDragging?: boolean;
  fontColor: string;
  hasRightBorder?: boolean;
  hasBottomBorder?: boolean;
}>`
  background: ${({ backgroundColor, isDragging }) =>
    isDragging ? 'transparent' : backgroundColor};

  -webkit-backdrop-filter: blur(6px) saturate(150%);
  backdrop-filter: blur(6px) saturate(150%);

  border-bottom: 1px solid
    ${({ borderColor, hasBottomBorder, isDragging }) =>
      hasBottomBorder && !isDragging ? borderColor : 'transparent'};
  border-right: ${({ borderColor, hasRightBorder }) =>
    hasRightBorder ? `1px solid ${borderColor}` : 'none'};

  color: ${({ fontColor }) => fontColor};

  padding: 0;

  text-align: left;
`;

export const RecordTableCellStyleWrapper = ({
  children,
  isSelected,
  isDragging,
  hasRightBorder = true,
  hasBottomBorder = true,
  widthClassName,
  ...divProps
}: {
  className?: string;
  children?: ReactNode;
  isSelected?: boolean;
  isDragging?: boolean;
  hasRightBorder?: boolean;
  hasBottomBorder?: boolean;
  widthClassName: string;
} & React.ComponentProps<'div'>) => {
  const { theme } = useContext(ThemeContext);

  // Translucent (not solid theme.background.primary) so the Electrotech
  // flickering-grid background shows through table cells too.
  const tdBackgroundColor = isSelected
    ? theme.accent.quaternary
    : `color-mix(in srgb, ${theme.background.primary} 50%, transparent)`;

  const borderColor = theme.border.color.light;

  const fontColor = theme.font.color.primary;

  return (
    <StyledCell
      isDragging={isDragging}
      backgroundColor={tdBackgroundColor}
      borderColor={borderColor}
      fontColor={fontColor}
      hasRightBorder={hasRightBorder}
      hasBottomBorder={hasBottomBorder}
      // oxlint-disable-next-line react/jsx-props-no-spreading
      {...divProps}
      className={cx('table-cell', widthClassName)}
    >
      {children}
    </StyledCell>
  );
};
