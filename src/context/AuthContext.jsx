import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import authAPI from '../api/authAPI';

const AuthContext = createContext(null);

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedToken) {
      setIsAuthLoading(false);
      return;
    }

    setToken(storedToken);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    authAPI
      .getCurrentUser()
      .then((data) => {
        const currentUser = data.user;
        setUser(currentUser);
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      })
      .catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('userEmail');
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  }, []);

  const persistAuth = (authData) => {
    const nextUser = authData.user;
    const nextToken = authData.token;

    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem('userEmail', nextUser.email);

    return authData;
  };

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    return persistAuth(data);
  };

  const register = async (name, email, password) => {
    const data = await authAPI.register({ name, email, password });
    return persistAuth(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('userEmail');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isAuthLoading,
      login,
      register,
      logout,
    }),
    [user, token, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
