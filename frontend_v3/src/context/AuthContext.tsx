import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, getAccessToken, logoutAndRedirect, setTokens } from '../lib/api';
import type { UserResponse, TokenResponse } from '../types/api';

interface AuthContextValue {
  user: UserResponse | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au chargement de l'app, si un token existe déjà (session précédente),
  // on tente de récupérer le profil pour restaurer la session automatiquement.
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    void refreshUser().finally(() => setIsLoading(false));
  }, []);

  async function refreshUser() {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const { data } = await api.get<UserResponse>('/players/me');
      setUser(data);
    } catch {
      setUser(null);
    }
  }

  async function login(email: string, password: string) {
    const { data } = await api.post<TokenResponse>('/auth/login', { email, password });
    setTokens(data.access_token, data.refresh_token);

    await refreshUser();
  }

  function logout() {
    setTokens(null, null);
    setUser(null);
    logoutAndRedirect();
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé à l\'intérieur de <AuthProvider>');
  return ctx;
}
