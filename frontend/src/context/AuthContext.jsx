import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.getMe();
      setUser(me);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  async function login(loginId, password) {
    const res = await authApi.login({ loginId, password });
    localStorage.setItem("token", res.token);
    await loadMe();
    return res;
  }

  async function register(payload) {
    return authApi.register(payload);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const isAdmin = user && ["admin", "super-admin"].includes(user.role);
  const isSuperAdmin = user && user.role === "super-admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin, isSuperAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
