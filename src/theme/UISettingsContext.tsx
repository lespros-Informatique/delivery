import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ColorPreset = 'blue' | 'purple' | 'teal' | 'green' | 'orange' | 'red' | 'pink' | 'cyan';
export type ScaleFactor = 'compact' | 'normal' | 'large';
export type BorderRadius = 'none' | 'small' | 'medium' | 'large';
export type Density = 'compact' | 'comfortable';
export type FontFamily = 'Inter' | 'Roboto' | 'System';
export type IconStyle = 'filled' | 'outlined';
export type IconColor = 'primary' | 'inherit' | 'current';

interface UISettingsContextType {
  primaryColor: ColorPreset;
  setPrimaryColor: (color: ColorPreset) => void;
  scaleFactor: ScaleFactor;
  setScaleFactor: (factor: ScaleFactor) => void;
  borderRadius: BorderRadius;
  setBorderRadius: (radius: BorderRadius) => void;
  animations: boolean;
  setAnimations: (enabled: boolean) => void;
  density: Density;
  setDensity: (density: Density) => void;
  fontFamily: FontFamily;
  setFontFamily: (family: FontFamily) => void;
  iconStyle: IconStyle;
  setIconStyle: (style: IconStyle) => void;
  iconColor: IconColor;
  setIconColor: (color: IconColor) => void;
  getScaleValue: (baseValue: number) => number;
}

const UISettingsContext = createContext<UISettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'ui-settings';

const SCALE_VALUES: Record<ScaleFactor, number> = {
  compact: 0.85,
  normal: 1,
  large: 1.15
};

const BORDER_RADIUS_VALUES: Record<BorderRadius, number> = {
  none: 0,
  small: 4,
  medium: 8,
  large: 16
};

const FONT_FAMILIES: Record<FontFamily, string> = {
  Inter: 'Inter, sans-serif',
  Roboto: 'Roboto, sans-serif',
  System: 'system-ui, -apple-system, sans-serif'
};

interface UISettings {
  primaryColor: ColorPreset;
  scaleFactor: ScaleFactor;
  borderRadius: BorderRadius;
  animations: boolean;
  density: Density;
  fontFamily: FontFamily;
  iconStyle: IconStyle;
  iconColor: IconColor;
}

const defaultSettings: UISettings = {
  primaryColor: 'blue',
  scaleFactor: 'normal',
  borderRadius: 'medium',
  animations: true,
  density: 'comfortable',
  fontFamily: 'Inter',
  iconStyle: 'filled',
  iconColor: 'primary'
};

export const UISettingsProvider = ({ children }: { children: ReactNode }) => {
  const [primaryColor, setPrimaryColorState] = useState<ColorPreset>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.primaryColor || defaultSettings.primaryColor;
        } catch {
          return defaultSettings.primaryColor;
        }
      }
    }
    return defaultSettings.primaryColor;
  });

  const [scaleFactor, setScaleFactorState] = useState<ScaleFactor>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.scaleFactor || defaultSettings.scaleFactor;
        } catch {
          return defaultSettings.scaleFactor;
        }
      }
    }
    return defaultSettings.scaleFactor;
  });

  const [borderRadius, setBorderRadiusState] = useState<BorderRadius>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.borderRadius || defaultSettings.borderRadius;
        } catch {
          return defaultSettings.borderRadius;
        }
      }
    }
    return defaultSettings.borderRadius;
  });

  const [animations, setAnimationsState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.animations ?? defaultSettings.animations;
        } catch {
          return defaultSettings.animations;
        }
      }
    }
    return defaultSettings.animations;
  });

  const [density, setDensityState] = useState<Density>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.density || defaultSettings.density;
        } catch {
          return defaultSettings.density;
        }
      }
    }
    return defaultSettings.density;
  });

  const [fontFamily, setFontFamilyState] = useState<FontFamily>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.fontFamily || defaultSettings.fontFamily;
        } catch {
          return defaultSettings.fontFamily;
        }
      }
    }
    return defaultSettings.fontFamily;
  });

  const [iconStyle, setIconStyleState] = useState<IconStyle>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.iconStyle || defaultSettings.iconStyle;
        } catch {
          return defaultSettings.iconStyle;
        }
      }
    }
    return defaultSettings.iconStyle;
  });

  const [iconColor, setIconColorState] = useState<IconColor>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.iconColor || defaultSettings.iconColor;
        } catch {
          return defaultSettings.iconColor;
        }
      }
    }
    return defaultSettings.iconColor;
  });

  useEffect(() => {
    const settings: UISettings = { primaryColor, scaleFactor, borderRadius, animations, density, fontFamily, iconStyle, iconColor };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [primaryColor, scaleFactor, borderRadius, animations, density, fontFamily, iconStyle, iconColor]);

  const setPrimaryColor = (color: ColorPreset) => {
    setPrimaryColorState(color);
  };

  const setScaleFactor = (factor: ScaleFactor) => {
    setScaleFactorState(factor);
  };

  const setBorderRadius = (radius: BorderRadius) => {
    setBorderRadiusState(radius);
  };

  const setAnimations = (enabled: boolean) => {
    setAnimationsState(enabled);
  };

  const setDensity = (dens: Density) => {
    setDensityState(dens);
  };

  const setFontFamily = (family: FontFamily) => {
    setFontFamilyState(family);
  };

  const setIconStyle = (style: IconStyle) => {
    setIconStyleState(style);
  };

  const setIconColor = (color: IconColor) => {
    setIconColorState(color);
  };

  const getScaleValue = (baseValue: number): number => {
    return baseValue * SCALE_VALUES[scaleFactor];
  };

  return (
    <UISettingsContext.Provider value={{ 
      primaryColor, 
      setPrimaryColor, 
      scaleFactor, 
      setScaleFactor,
      borderRadius,
      setBorderRadius,
      animations,
      setAnimations,
      density,
      setDensity,
      fontFamily,
      setFontFamily,
      iconStyle,
      setIconStyle,
      iconColor,
      setIconColor,
      getScaleValue 
    }}>
      {children}
    </UISettingsContext.Provider>
  );
};

export const useUISettings = (): UISettingsContextType => {
  const context = useContext(UISettingsContext);
  if (!context) {
    throw new Error('useUISettings must be used within a UISettingsProvider');
  }
  return context;
};

export const useIconSettings = () => {
  const { iconStyle, iconColor } = useUISettings();
  return { iconStyle, iconColor };
};