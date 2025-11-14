"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
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

const API_URL = "http://localhost:8080";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ------------------------------------------------------
  // 🔄 Carrega user + token do localStorage ao iniciar
  // ------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        setUser({
          id: decoded.id ?? "",
          name: decoded.name ?? decoded.sub?.split("@")[0] ?? "",
          email: decoded.sub,
          createdAt: new Date(),
          goals: [],
          skills: [],
          careerObjective: decoded.careerObjective ?? "",
        });
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
        localStorage.removeItem("token");
      }
    }

    setIsLoading(false);
  }, []);

  // ------------------------------------------------------
  // 🔐 LOGIN — POST /login
  // ------------------------------------------------------
  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Credenciais inválidas");

    const data = await response.json(); // { token, username }

    localStorage.setItem("token", data.token);

    const decoded: any = jwtDecode(data.token);

    const loggedUser: User = {
      id: decoded.id ?? "",
      name: decoded.name ?? decoded.sub?.split("@")[0] ?? "",
      email: decoded.sub,
      goals: [],
      skills: [],
      careerObjective: decoded.careerObjective ?? "",
      createdAt: new Date(),
    };

    setUser(loggedUser);
  };

  // ------------------------------------------------------
  // 📝 REGISTER — POST /register
  // (agora compatível com o backend Oracle)
  // ------------------------------------------------------
  const register = async (
    name: string,
    email: string,
    password: string,
    careerObjective: string
  ) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: name,                       // ✔ correto para o model Oracle
        email,
        password,
        professionalGoal: careerObjective // ✔ correto para a coluna Oracle
      }),
    });

    if (!response.ok) throw new Error("Erro ao registrar");

    const data = await response.json(); // { token, username }

    localStorage.setItem("token", data.token);

    const decoded: any = jwtDecode(data.token);

    const newUser: User = {
      id: decoded.id ?? "",
      name,
      email,
      careerObjective,
      goals: [],
      skills: [],
      createdAt: new Date(),
    };

    setUser(newUser);
  };

  // ------------------------------------------------------
  // 🔧 Atualização local do perfil
  // ------------------------------------------------------
  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
  };

  // ------------------------------------------------------
  // 🚪 LOGOUT
  // ------------------------------------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
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
