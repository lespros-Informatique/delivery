/**
 * useAuth – Authentication State Management
 * ==========================================
 * Context + Hook for managing authentication state throughout the app.
 *
 * Security:
 * - HTTP-only cookies store the JWT (XSS-safe).
 * - localStorage stores ONLY the user object for UI display.
 * - Token refresh is scheduled automatically every 12 minutes.
 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { authService, AuthUser } from '../lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (
    email: string,
    password: string,
    nomUser: string,
    telephoneUser?: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref pour le timer de refresh (évite la dépendance circulaire useCallback)
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Token Refresh silencieux ─────────────────────────────────────────────

  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Refresh 3 min avant expiration (token valide 15 min → timer à 12 min)
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const response = await authService.refresh();
        if (response.success && response.data) {
          authService.setCurrentUser(response.data.user);
          setUser(response.data.user);
          scheduleTokenRefresh(); // Planifier le prochain refresh
        }
      } catch {
        // Si le refresh échoue, on déconnecte proprement
        handleLogout();
      }
    }, 12 * 60 * 1000);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Initialisation ──────────────────────────────────────────────────────

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
        scheduleTokenRefresh();
      }
      setIsLoading(false);
    };

    initAuth();

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Logout interne (partagé par logout() et scheduleTokenRefresh) ────────

  const handleLogout = useCallback(async () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    try {
      await authService.logout();
    } catch {
      // Ignorer les erreurs réseau lors du logout
    }

    authService.clearCurrentUser();
    setUser(null);
    window.location.href = '/delivery/login';
  }, []);

  // ─── Login ────────────────────────────────────────────────────────────────

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.login({ email, password });

        if (response.success && response.data) {
          authService.setCurrentUser(response.data.user);
          setUser(response.data.user);
          scheduleTokenRefresh();
          return { success: true };
        }

        const msg = response.message ?? 'Échec de la connexion';
        setError(msg);
        return { success: false, message: msg };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
          'Erreur lors de la connexion';
        setError(msg);
        return { success: false, message: msg };
      } finally {
        setIsLoading(false);
      }
    },
    [scheduleTokenRefresh]
  );

  // ─── Register ────────────────────────────────────────────────────────────

  const register = useCallback(
    async (email: string, password: string, nomUser: string, telephoneUser?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.register({ email, password, nomUser, telephoneUser });

        if (response.success && response.data) {
          authService.setCurrentUser(response.data.user);
          setUser(response.data.user);
          scheduleTokenRefresh();
          return { success: true };
        }

        const msg = response.message ?? "Échec de l'inscription";
        setError(msg);
        return { success: false, message: msg };
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
          "Erreur lors de l'inscription";
        setError(msg);
        return { success: false, message: msg };
      } finally {
        setIsLoading(false);
      }
    },
    [scheduleTokenRefresh]
  );

  // ─── Context Value ────────────────────────────────────────────────────────

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un <AuthProvider>");
  }
  return context;
};

export default useAuth;
