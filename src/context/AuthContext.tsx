import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/authService'; // Asegúrate de que la ruta sea correcta
import { LoginRequestDto, RegisterRequestDto } from '../types/Auth';

export type AuthContextType = {
  token: string | null;
  register: (data: LoginRequestDto) => Promise<void>;
  login: (data: RegisterRequestDto) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  register: async () => {},
  login: () => Promise.resolve(),
  logout: () => {},
  isAuthenticated: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const safeBase64Decode = (payload: string) => {
    try {
      return atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const isTokenValidStructure = (token: string) => {
    const parts = token.split('.');
    return parts.length === 3;
  };

  const isTokenExpired = useCallback((token: string): boolean => {
    if (!isTokenValidStructure(token)) return true;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = safeBase64Decode(payload);
      if (!decodedPayload) return true;

      const { exp } = JSON.parse(decodedPayload);
      if (typeof exp !== 'number') return true;

      return Date.now() >= exp * 1000;
    } catch (error) {
      console.error('Error processing token:', error);
      return true;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      sessionStorage.removeItem('token');
      setToken(null);
    }
  }, []);

  const login = useCallback(
    async (data: RegisterRequestDto) => {
      try {
        const { token: newToken } = await apiLogin(data);
        if (!newToken || !isTokenValidStructure(newToken) || isTokenExpired(newToken)) {
          console.error('Invalid or expired token');
          logout();
          return;
        }
        sessionStorage.setItem('token', newToken);
        setToken(newToken);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    [isTokenExpired, logout]
  );

  const register = useCallback(
    async (data: RegisterRequestDto) => {
      try {
        const { token: newToken } = await apiRegister(data);
        console.log('Token from register:', newToken); // Debugging line
        if (!newToken || !isTokenValidStructure(newToken) || isTokenExpired(newToken)) {
          console.error('Invalid or expired token');
          logout();
          return;
        }
        sessionStorage.setItem('token', newToken);
        setToken(newToken);
      }
      catch (error) {
        console.error('Register failed:', error);
        throw error;
      }
    },
    [isTokenExpired, logout]
  );

  useEffect(() => {
    const validateStoredToken = () => {
      const storedToken = sessionStorage.getItem('token');
      if (storedToken && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        return true;
      }
      logout();
      return false;
    };

    setIsLoading(true);
    validateStoredToken();
    setIsLoading(false);

    // Configurar verificación periódica cada minuto
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        logout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [token, isTokenExpired, logout]);

  const isAuthenticated = useCallback(() => {
    return !!token && !isTokenExpired(token);
  }, [token, isTokenExpired]);

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated , register }}>
      {isLoading ? <div>Cargando...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;