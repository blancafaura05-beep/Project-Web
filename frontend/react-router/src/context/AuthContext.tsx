import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../models/user";
import { me, logout as apiLogout } from "../api/auth";
import { getToken } from "../api/client";

type AuthCtx = {
  user: User | null;
  refresh: () => Promise<void>;
  logout: () => void;
  isLogged: boolean;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const refresh = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const u = await me();
      setUser(u);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, refresh, logout, isLogged: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
