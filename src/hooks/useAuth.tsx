/**
 * Auth Hook - Authentication State Management
 * ==========================================
 * React hook for managing authentication state with Provider
 * 
 * Security Features:
 * - HTTP-only cookies for token storage (XSS protection)
 * - Automatic token refresh before expiration
 * - Secure logout with cookie clearing
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { authService, AuthUser } from '../lib/api';

// Type definitions
interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, nomUser: string, telephoneUser?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  error: string | null;
}

// Create context
const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

// Auth Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      // Check if we have a stored user (from previous session)
      const storedUser = authService.getCurrentUser();
      
      if (storedUser) {
        setUser(storedUser);
        // Start token refresh timer
        scheduleTokenRefresh();
      }
      setIsLoading(false);
    };

    initAuth();

    // Cleanup timer on unmount
    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
    };
  }, []);

  // Schedule token refresh (every 12 minutes for 15min tokens)
  const scheduleTokenRefresh = useCallback(() => {
    // Clear any existing timer
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    // Refresh token 3 minutes before expiration (15min token)
    const timer = setTimeout(async () => {
      try {
        const response = await authService.refresh();
        if (response.success && response.data) {
          authService.setCurrentUser(response.data.user);
          setUser(response.data.user);
          scheduleTokenRefresh(); // Schedule next refresh
        }
      } catch (err) {
        console.error('Token refresh failed:', err);
        // If refresh fails, user will need to login again
        logout();
      }
    }, 12 * 60 * 1000); // 12 minutes

    setRefreshTimer(timer);
  }, [refreshTimer]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        // Store user for UI state (not for auth - cookies handle that)
        authService.setCurrentUser(response.data.user);
        setUser(response.data.user);
        // Schedule token refresh
        scheduleTokenRefresh();
        return { success: true };
      } else {
        setError(response.message || 'Échec de la connexion');
        return { success: false, message: response.message };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [scheduleTokenRefresh]);

  const register = useCallback(async (
    email: string, 
    password: string, 
    nomUser: string, 
    telephoneUser?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register({ 
        email, 
        password, 
        nomUser, 
        telephoneUser 
      });
      
      if (response.success && response.data) {
        // Store user for UI state
        authService.setCurrentUser(response.data.user);
        setUser(response.data.user);
        // Schedule token refresh
        scheduleTokenRefresh();
        return { success: true };
      } else {
        setError(response.message || "Échec de l'inscription");
        return { success: false, message: response.message };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erreur lors de l'inscription";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [scheduleTokenRefresh]);

  const logout = useCallback(async () => {
    // Clear timer
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      setRefreshTimer(null);
    }

    // Call logout endpoint to clear cookies
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }

    // Clear local state
    authService.clearCurrentUser();
    setUser(null);
    
    // Redirect to login (use relative path with base)
    window.location.href = '/delivery/login';
  }, [refreshTimer]);

  const value: UseAuthReturn = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
