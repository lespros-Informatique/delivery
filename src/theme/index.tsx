import { createTheme as createMuiTheme, PaletteMode } from '@mui/material/styles';
import { createComponents } from './create-components';
import { createPalette } from './create-palette';
import { createShadows } from './create-shadows';
import { createTypography } from './create-typography';

interface ThemeConfig {
  colorPreset: string;
  contrast: string;
  mode: PaletteMode;
}

export function createTheme(config: ThemeConfig) {
  const { colorPreset, contrast, mode } = config;
  const palette = createPalette({ colorPreset, contrast, mode });
  const components = createComponents({ palette });
  const shadows = createShadows({ palette });
  const typography = createTypography();

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
    shadows,
    shape: {
      borderRadius: 6
    },
    typography
  });
}
