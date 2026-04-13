import { useMemo, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { routes } from './routes';
import { createTheme } from './theme';
import { ThemeModeProvider, useThemeMode } from './theme/ThemeContext';
import { AuthProvider } from './hooks/useAuth';
import { UISettingsProvider, useUISettings } from './theme/UISettingsContext';
import { Toaster } from 'react-hot-toast';
import 'simplebar-react/dist/simplebar.min.css';

const AppContent = () => {
  const element = useRoutes(routes);
  const { mode } = useThemeMode();
  const { primaryColor, scaleFactor, borderRadius, animations, density, fontFamily, iconColor } = useUISettings();
  
  // Utiliser useMemo pour éviter de recréer le thème à chaque render
  const theme = useMemo(() => {
    return createTheme({
      colorPreset: primaryColor,
      contrast: 'high',
      mode,
      scaleFactor,
      borderRadius,
      animations,
      density,
      fontFamily
    });
  }, [mode, primaryColor, scaleFactor, borderRadius, animations, density, fontFamily]);

  // Appliquer couleur d'icônevia CSS personnalisé
  useEffect(() => {
    const colorMap: Record<string, string> = {
      current: 'currentColor',
      primary: '#1976d2', // Default MUI primary blue - this can be updated based on primaryColor
      inherit: 'inherit'
    };
    const iconColorValue = colorMap[iconColor] || 'inherit';
    document.documentElement.style.setProperty('--icon-color', iconColorValue);
  }, [iconColor]);

  // Injecter style global pour les icônes
  useEffect(() => {
    const styleId = 'global-icon-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      .MuiSvgIcon-root:not([color="primary"]):not([color="secondary"]):not([color="inherit"]):not([color="action"]):not([color="disabled"]):not([color="error"]) {
        color: var(--icon-color) !important;
      }
    `;
    return () => {};
  }, [iconColor]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" />
      {element}
    </ThemeProvider>
  );
};

export const App = () => {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <UISettingsProvider>
          <AppContent />
        </UISettingsProvider>
      </AuthProvider>
    </ThemeModeProvider>
  );
};
