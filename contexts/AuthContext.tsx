 "use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/types/User";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    careerObjective: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const API_URL = "http://localhost:8080"; //desenvolvimento local
const API_URL = "172.172.1.188:8000"; //production

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ------------------------------------------------------
  // 🔄 Carrega user do localStorage ao iniciar
  // ------------------------------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    setIsLoading(false);
  }, []);

  // ------------------------------------------------------
  // 🔐 LOGIN — POST /auth/login
  // ------------------------------------------------------
  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Credenciais inválidas");

    const data = await response.json();

    // token vem assim: data.tokenResponse.token
    const token = data.token.token;

    localStorage.setItem("token", token);

    const loggedUser: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      careerObjective: data.professionalGoal,
      goals: [],
      skills: [],
      role: data.role,
      createdAt: new Date(),
    };

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
  };

  // ------------------------------------------------------
  // 📝 REGISTER — POST /auth/register
  // ------------------------------------------------------
  const register = async (
    name: string,
    email: string,
    password: string,
    careerObjective: string
  ) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: name,
        email,
        password,
        professionalGoal: careerObjective,
      }),
    });

    if (!response.ok) throw new Error("Erro ao registrar");

    const data = await response.json();

    // token também está dentro de data.token.token
    const token = data.token.token;
    localStorage.setItem("token", token);

    const newUser: User = {
      id: data.id,
      name,
      email,
      careerObjective,
      goals: [],
      skills: [],
      role: data.role,
      createdAt: new Date(),
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // ------------------------------------------------------
  // 🔧 Atualização local do perfil
  // ------------------------------------------------------
  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  // ------------------------------------------------------
  // 🚪 LOGOUT
  // ------------------------------------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
