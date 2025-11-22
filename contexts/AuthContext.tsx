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
  updateProfile: (updates: Partial<User>) => Promise<void>; // Agora retorna Promise
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:8080"; 

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Init
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.id) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
        } else {
            setUser(parsedUser);
        }
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error("Credenciais inválidas");

    const data = await response.json();
    
    let token = null;
    if (data.token && typeof data.token === 'object' && data.token.token) token = data.token.token;
    else if (data.token && typeof data.token === 'string') token = data.token;
    else if (data.accessToken) token = data.accessToken;

    if (!token) throw new Error("Token inválido");

    localStorage.setItem("token", token);

    const loggedUser: User = {
      id: data.id || data.userId, 
      name: data.name,
      email: data.email,
      careerObjective: data.professionalGoal || "",
      // Inicializa vazio se não vier no login
      // Para carregar skills reais, o ideal seria um fetch("/users/me")
      goals: [], 
      skills: [], 
      role: data.role || "USER",
      createdAt: new Date(),
    };

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
  };

  // Register
  const register = async (name: string, email: string, password: string, careerObjective: string) => {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, professionalGoal: careerObjective }),
    });

    if (!response.ok) throw new Error("Erro ao registrar");
    await login(email, password);
  };

  // --- UPDATE PROFILE (AGORA COM FETCH) ---
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
        const token = localStorage.getItem("token");
        
        // Processa skills para enviar ao backend
        let skillsToSend = updates.skills ?? user.skills;
        
        // Se tiver skills, precisa enviar cada uma com POST ao /skills
        if (updates.skills && updates.skills.length > 0) {
            // Primeiro, salva as skills individuais
            for (const skill of updates.skills) {
                const [skillName, skillType] = skill.includes("|") ? skill.split("|") : [skill, "HARD"];
                
                try {
                    await fetch(`${API_URL}/skills?userId=${user.id}`, {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            name: skillName,
                            type: skillType
                        }),
                    });
                } catch (skillError) {
                    console.warn("Erro ao salvar skill:", skillName, skillError);
                }
            }
        }
        
        // Mapeia para o DTO que o Java espera (sem skills, pois já foram salvas)
        const professionalGoal = updates.careerObjective ?? user.careerObjective;
        const payload = {
            name: updates.name ?? user.name,
            professionalGoal: professionalGoal && professionalGoal.trim() !== "" 
                ? professionalGoal 
                : "Não definido", // Valor padrão se estiver vazio
        };

        const response = await fetch(`${API_URL}/users/${user.id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error("Falha ao salvar perfil no servidor");
        }

        // Se deu certo no servidor, atualiza localmente
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        
        console.log("Perfil salvo com sucesso no banco!");

    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        throw error; // Repassa erro para o componente mostrar Toast
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}