import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  role: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users pour l'authentification
const mockUsers = [
  { email: 'admin@woli.com', password: 'admin123', name: 'Admin Woli', role: 'admin' },
  { email: 'restaurant@woli.com', password: 'resto123', name: 'Restaurant Owner', role: 'restaurant_owner' },
  { email: 'manager@woli.com', password: 'manager123', name: 'Manager', role: 'manager' },
  { email: 'livreur@woli.com', password: 'livreur123', name: 'Livreur', role: 'livreur' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.isAuthenticated) {
          setUser(parsedUser);
        }
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simuler une vérification d'authentification
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData: User = {
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        isAuthenticated: true
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
