import { styled } from '@linaria/react';
import { useEffect, useRef } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledCanvas = styled.canvas`
  bottom: 0;
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  /* Negative z-index (not 0) so it paints behind ALL siblings, including
     non-positioned in-flow ones — a positioned z-index:0 descendant
     actually paints ABOVE non-positioned in-flow content per CSS stacking
     rules, which would cover the page instead of sitting behind it. */
  z-index: -1;
`;

const SQUARE_SIZE = 4;
const GAP = 10;
const FLICKER_CHANCE = 0.35;
const MAX_OPACITY = 0.3;

// Портировано из макета «Электротех» (scratchpad/electrotech_mockup.html,
// одобренный вариант фона "Flickering Grid" — см. artwork 28.08/скрин
// пользователя 04.09) — тот же алгоритм, тот же цвет через CSS-переменную
// акцента темы вместо хардкода, чтобы совпадало со светлой/тёмной темой.
export const FlickeringGridBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    let cols = 0;
    let rows = 0;
    let opacities: Float32Array = new Float32Array(0);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrameId = 0;
    let lastTimestamp = performance.now();

    // themeCssVariables.accent.primary is 'var(--t-accent-primary)' —
    // getPropertyValue() needs the bare custom-property name, not the
    // var(...) wrapper.
    const accentVarName = themeCssVariables.accent.primary
      .replace('var(', '')
      .replace(')', '');

    const getAccentRgb = (): [number, number, number] => {
      const rootStyles = getComputedStyle(document.documentElement);
      const hex = rootStyles.getPropertyValue(accentVarName).trim();
      const match = hex.replace('#', '').match(/.{1,2}/g);
      if (!match || match.length < 3) return [46, 92, 255];
      return [
        parseInt(match[0], 16),
        parseInt(match[1], 16),
        parseInt(match[2], 16),
      ];
    };

    const resizeGrid = () => {
      const parent = canvas.parentElement;
      const width = parent?.clientWidth ?? window.innerWidth;
      const height = parent?.clientHeight ?? window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      cols = Math.ceil(width / (SQUARE_SIZE + GAP));
      rows = Math.ceil(height / (SQUARE_SIZE + GAP));
      opacities = new Float32Array(cols * rows);
      for (let i = 0; i < opacities.length; i++) {
        opacities[i] = Math.random() * MAX_OPACITY;
      }
    };

    const drawGrid = (now: number) => {
      const deltaSeconds = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;
      const [r, g, b] = getAccentRgb();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          if (
            !reduceMotion.matches &&
            Math.random() < FLICKER_CHANCE * deltaSeconds
          ) {
            opacities[idx] = Math.random() * MAX_OPACITY;
          }
          const opacity = opacities[idx];
          if (opacity > 0.02) {
            ctx.fillStyle = `rgba(${r},${g},${b},${opacity.toFixed(3)})`;
            ctx.fillRect(
              x * (SQUARE_SIZE + GAP) * dpr,
              y * (SQUARE_SIZE + GAP) * dpr,
              SQUARE_SIZE * dpr,
              SQUARE_SIZE * dpr,
            );
          }
        }
      }
      if (!reduceMotion.matches) {
        animationFrameId = requestAnimationFrame(drawGrid);
      }
    };

    resizeGrid();
    window.addEventListener('resize', resizeGrid);
    animationFrameId = requestAnimationFrame(drawGrid);

    return () => {
      window.removeEventListener('resize', resizeGrid);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <StyledCanvas ref={canvasRef} aria-hidden="true" />;
};
