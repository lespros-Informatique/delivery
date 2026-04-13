import { common } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { error, info, neutral, success, warning, star, white, chart } from './colors';
import { getPrimary } from './utils';

interface PaletteConfig {
  colorPreset: string;
  contrast: string;
  mode: 'light' | 'dark';
}

export const createPalette = (config: PaletteConfig) => {
  const { colorPreset, contrast, mode } = config;

  const isDark = mode === 'dark';
  
  return {
    action: {
      active: isDark ? neutral[400] : neutral[600],
      disabled: alpha(isDark ? neutral[100] : neutral[900], 0.38),
      disabledBackground: alpha(isDark ? neutral[100] : neutral[900], 0.12),
      focus: alpha(isDark ? neutral[100] : neutral[900], 0.16),
      hover: alpha(isDark ? neutral[100] : neutral[900], isDark ? 0.12 : 0.04),
      selected: alpha(isDark ? neutral[100] : neutral[900], 0.16)
    },
    background: {
      default: isDark ? '#141a21' : (contrast === 'high' ? '#FCFCFD' : common.white),
      paper: isDark ? '#1d232e' : common.white
    },
    divider: isDark ? '#2d3545' : '#F2F4F7',
    error,
    info,
    mode,
    neutral: isDark ? {
      ...neutral,
      50: '#1d232e',
      100: '#242d3c',
      200: '#2d3545',
      300: '#3d4a5e',
      400: '#5a6d86',
      500: '#7888a8',
      600: '#9ca8c4',
      700: '#c4d0e0',
      800: '#e0e8f4',
      900: '#f0f6fc'
    } : neutral,
    primary: getPrimary(colorPreset),
    success,
    text: {
      primary: isDark ? '#e0e8f4' : neutral[900],
      secondary: isDark ? '#7888a8' : neutral[500],
      disabled: alpha(isDark ? '#e0e8f4' : neutral[900], 0.38)
    },
    warning,
    star,
    white,
    chart
  };
};
