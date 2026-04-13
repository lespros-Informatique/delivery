const SCALE_MAP = {
  compact: 0.85,
  normal: 1,
  large: 1.15
};

type ScaleFactor = 'compact' | 'normal' | 'large';
type FontFamily = 'Inter' | 'Roboto' | 'System';

const FONT_FAMILIES: Record<FontFamily, string> = {
  Inter: 'Inter, sans-serif',
  Roboto: 'Roboto, sans-serif',
  System: 'system-ui, -apple-system, sans-serif'
};

export const createTypography = (scaleFactor: ScaleFactor = 'normal', fontFamily: FontFamily = 'Inter') => {
  const scale = SCALE_MAP[scaleFactor];
  const family = FONT_FAMILIES[fontFamily];
  
  return {
    fontFamily: family,
    h1: {
      fontSize: 48 * scale,
      fontWeight: 600,
      lineHeight: 1.5
    },
    h2: {
      fontSize: 36 * scale,
      fontWeight: 600,
      lineHeight: 1.5
    },
    h3: {
      fontSize: 32 * scale,
      fontWeight: 600,
      lineHeight: 1.5
    },
    h4: {
      fontSize: 24 * scale,
      fontWeight: 600,
      lineHeight: 1.5
    },
    h5: {
      fontSize: 18 * scale,
      fontWeight: 600,
      lineHeight: 1.5
    },
    h6: {
      fontSize: 16 * scale,
      fontWeight: 600,
      lineHeight: 1.5
    },
    body1: {
      fontSize: 15 * scale,
      lineHeight: 1.5
    },
    body2: {
      fontSize: 14 * scale,
      lineHeight: 1.6
    },
    subtitle1: {
      fontSize: 16 * scale,
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: 1.75
    },
    subtitle2: {
      fontSize: 14 * scale,
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: 1.75
    },
    caption: {
      fontSize: 12 * scale,
      fontWeight: 400,
      lineHeight: 1.6
    },
    overline: {
      fontSize: 12 * scale,
      fontWeight: 600,
      letterSpacing: 1,
      lineHeight: 2.46
    },
    button: {
      fontSize: 14 * scale,
      fontWeight: 500,
      textTransform: 'none'
    }
  };
};