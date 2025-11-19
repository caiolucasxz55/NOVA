"use client";

import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

interface ApiContextType {
  askChatbot: (message: string) => Promise<string>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

// const API_URL = "http://localhost:8080/api/chatbot"; //desenvolvimento local
const API_URL = "172.172.1.188:8000/api/chatbot"; //production

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const askChatbot = async (message: string): Promise<string> => {
  try {
    if (!user?.id) {
      console.error("Usuário não autenticado — userId ausente");
      return "Erro: usuário não autenticado.";
    }

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ Envia o JWT
      },
      body: JSON.stringify({
        userId: user.id,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao chamar o chatbot");
    }

    const data = await response.json();
    return data.answer;
  } catch (err) {
    console.error("Erro no chatbot:", err);
    return "Erro ao conectar ao servidor.";
  }
};


  return (
    <ApiContext.Provider value={{ askChatbot }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi deve ser usado dentro de ApiProvider");
  return ctx;
}
