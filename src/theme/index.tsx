import { createTheme as createMuiTheme, PaletteMode } from '@mui/material/styles';
import { createComponents } from './create-components';
import { createPalette } from './create-palette';
import { createShadows } from './create-shadows';
import { createTypography } from './create-typography';
export { AppIcon, useIconSx } from './AppIcon';

interface ThemeConfig {
  colorPreset: string;
  contrast: string;
  mode: PaletteMode;
  scaleFactor?: 'compact' | 'normal' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  animations?: boolean;
  density?: 'compact' | 'comfortable';
  fontFamily?: 'Inter' | 'Roboto' | 'System';
}

export function createTheme(config: ThemeConfig) {
  const { 
    colorPreset, 
    contrast, 
    mode, 
    scaleFactor = 'normal', 
    borderRadius = 'medium', 
    animations = true,
    density = 'comfortable',
    fontFamily = 'Inter'
  } = config;
  const palette = createPalette({ colorPreset, contrast, mode });
  const components = createComponents({ palette, density });
  const shadows = createShadows({ palette });
  const typography = createTypography(scaleFactor, fontFamily);

  const radiusMap = { none: 0, small: 4, medium: 8, large: 16 };

  return createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440
      }
    },
    components,
    palette,
    shadows: shadows as any,
    shape: {
      borderRadius: radiusMap[borderRadius]
    },
    typography,
    transitions: {
      duration: {
        shortest: animations ? 150 : 0,
        shorter: animations ? 200 : 0,
        short: animations ? 250 : 0,
        standard: animations ? 300 : 0,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  });
}
