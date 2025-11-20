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

const API_URL = "http://localhost:8080"; // desenvolvimento local
// const API_URL = "http://172.172.112.144:8000"; // production

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
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // BLINDAGEM: Se o usuário salvo não tiver ID válido (cache antigo), força limpeza
        // Isso resolve o erro "userId ausente" no Chatbot
        if (!parsedUser.id || parsedUser.id === 0) {
            console.warn("⚠️ Sessão antiga detectada (sem ID). Forçando logout para atualizar dados.");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
        } else {
            setUser(parsedUser);
        }

      } catch (e) {
        console.error("Erro ao restaurar sessão:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
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

    if (!response.ok) {
       try {
         const err = await response.json();
         console.error("Login Error Payload:", err);
       } catch(e) {}
       throw new Error("Credenciais inválidas ou erro no servidor.");
    }

    const data = await response.json();
    
    // DEBUG: Mostra no console o que chegou do backend
    console.log("Resposta do Login (Debug):", data);

    // --- 1. EXTRAÇÃO DO TOKEN ---
    let token = null;
    if (data.token && typeof data.token === 'object' && data.token.token) {
        token = data.token.token;
    } else if (data.token && typeof data.token === 'string') {
        token = data.token;
    } else if (data.accessToken) {
        token = data.accessToken;
    }

    if (!token) {
        console.error("Estrutura inválida recebida:", data);
        throw new Error("O servidor não retornou um token válido. Verifique o console.");
    }

    localStorage.setItem("token", token);

    // --- 2. EXTRAÇÃO DO NOME (Correção do 'Olá Usuário') ---
    const foundName = 
        data.name ||          
        data.nome ||          
        data.user?.name ||    
        data.user?.nome ||    
        data.username ||      
        email.split("@")[0];

    // Monta o objeto usuário com ID real vindo do Java
    const loggedUser: User = {
      id: data.id || data.userId || 0, 
      name: foundName, 
      email: data.email || email,
      careerObjective: data.professionalGoal || data.careerObjective || "", 
      goals: [],
      skills: [],
      role: data.role || "USER",
      createdAt: new Date(),
    };

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
  };

  // ------------------------------------------------------
  // 📝 REGISTER — POST /users
  // ------------------------------------------------------
  const register = async (
    name: string,
    email: string,
    password: string,
    careerObjective: string
  ) => {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name, 
        email,
        password,
        professionalGoal: careerObjective,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro no registro:", errorData);
      
      if (errorData.errors && Array.isArray(errorData.errors)) {
          throw new Error(errorData.errors.join(", "));
      }
      throw new Error("Erro ao registrar. Verifique os dados.");
    }

    console.log("Registro OK. Iniciando Login automático...");
    await login(email, password);
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