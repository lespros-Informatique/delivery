import { common } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { error, info, neutral, success, warning } from './colors';
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
      hover: alpha(isDark ? neutral[100] : neutral[900], isDark ? 0.08 : 0.04),
      selected: alpha(isDark ? neutral[100] : neutral[900], 0.12)
    },
    background: {
      default: isDark ? '#0A0A0A' : (contrast === 'high' ? '#FCFCFD' : common.white),
      paper: isDark ? '#141414' : common.white
    },
    divider: isDark ? '#262626' : '#F2F4F7',
    error,
    info,
    mode,
    neutral: isDark ? {
      ...neutral,
      50: '#141414',
      100: '#1F1F1F',
      200: '#262626',
      300: '#363636',
      400: '#565656',
      500: '#787878',
      600: '#999999',
      700: '#BDBDBD',
      800: '#E4E4E4',
      900: '#F5F5F5'
    } : neutral,
    primary: getPrimary(colorPreset),
    success,
    text: {
      primary: isDark ? neutral[50] : neutral[900],
      secondary: isDark ? neutral[500] : neutral[500],
      disabled: alpha(isDark ? neutral[50] : neutral[900], 0.38)
    },
    warning
  };
};
