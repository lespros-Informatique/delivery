import { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { routes } from './routes';
import { createTheme } from './theme';
import { ThemeModeProvider, useThemeMode } from './theme/ThemeContext';
import { AuthProvider } from './hooks/useAuth';
import 'simplebar-react/dist/simplebar.min.css';

const AppContent = () => {
  const element = useRoutes(routes);
  const { mode } = useThemeMode();
  
  // Utiliser useMemo pour éviter de recréer le thème à chaque render
  const theme = useMemo(() => {
    return createTheme({
      colorPreset: 'green',
      contrast: 'high',
      mode
    });
  }, [mode, /* colorPreset et contrast sont fixes */]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {element}
    </ThemeProvider>
  );
};

export const App = () => {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeModeProvider>
  );
};
