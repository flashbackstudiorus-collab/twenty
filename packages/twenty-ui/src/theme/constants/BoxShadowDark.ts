import { RGBA } from '@ui/theme/constants/Rgba';

/* oxlint-disable twenty/no-hardcoded-colors */
export const BOX_SHADOW_DARK = {
  color: RGBA('#000000', 0.6),
  light: `0px 2px 6px 0px ${RGBA('#000000', 0.3)}, 0px 1px 2px 0px ${RGBA(
    '#000000',
    0.2,
  )}`,
  strong: `0px 20px 50px 0px ${RGBA('#000000', 0.45)}, 0px 2px 6px 0px ${RGBA(
    '#000000',
    0.3,
  )}`,
  underline: `0px 1px 0px 0px ${RGBA('#000000', 0.32)}`,
  superHeavy: `2px 4px 16px 0px ${RGBA(
    '#000000',
    0.12,
  )}, 0px 2px 4px 0px ${RGBA('#000000', 0.04)}`,
};
