import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axiosInstance, {
  setAuthToken,
  registerAuthCallbacks,
} from "../utils/axiosInstance";

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
      const res = await axiosInstance.get("/api/auth/refresh");
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
      await axiosInstance.post("/api/auth/logout", {});
    } catch {
      /* ignore */
    }
    setUser(null);
    setAccessToken(null);
    setAuthToken(null);
  }, []);

  useEffect(() => {
    registerAuthCallbacks(refreshAccessToken, logout);
  }, [refreshAccessToken, logout]);

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

export const useAuth = () => useContext(userContext);
export { AuthContext };
