import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import API_BASE from "../utils/api";
import { setAuthToken, registerAuthCallbacks } from "../utils/axiosInstance";

const userContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
    setAuthToken(token);
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/auth/refresh`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
        setAuthToken(res.data.accessToken);
        return res.data.accessToken;
      }
    } catch {
      setUser(null);
      setAccessToken(null);
      setAuthToken(null);
    }
    return null;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${API_BASE}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
    } catch {
      /* ignore */
    }
    setUser(null);
    setAccessToken(null);
    setAuthToken(null);
  }, []);

  // Register callbacks with axiosInstance once
  useEffect(() => {
    registerAuthCallbacks(refreshAccessToken, logout);
  }, [refreshAccessToken, logout]);

  // Restore session on app load
  useEffect(() => {
    const restoreSession = async () => {
      await refreshAccessToken();
      setLoading(false);
    };
    restoreSession();
  }, [refreshAccessToken]);

  return (
    <userContext.Provider
      value={{ user, accessToken, login, logout, loading, refreshAccessToken }}
    >
      {children}
    </userContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(userContext);
export { AuthContext };
