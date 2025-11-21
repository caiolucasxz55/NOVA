"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useAuth } from "./AuthContext";

export type ChatMessage = {
  id?: number;
  from: "user" | "bot";
  text: string;
};

interface ApiContextType {
  askChatbot: (message: string) => Promise<string>;
  getHistory: () => Promise<ChatMessage[]>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const API_URL = "http://localhost:8080/api/chatbot"; 

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const getHistory = useCallback(async (): Promise<ChatMessage[]> => {
    // DEBUG: Verifica se tem usuário antes de chamar
    console.log("🔍 Tentando buscar histórico. User ID:", user?.id);

    if (!user?.id) {
        console.warn("⚠️ Usuário sem ID, cancelando busca de histórico.");
        return [];
    }

    try {
      const token = localStorage.getItem("token");
      const url = `${API_URL}/history?userId=${user.id}`;
      console.log("🚀 Fetching URL:", url);

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        cache: 'no-store' // Evita cache velho
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📦 Histórico recebido do Java:", data);
        
        // Mapeia a resposta do Java (ChatMessageDTO) para o formato do Front
        const formattedHistory = data.map((msg: any, index: number) => ({
            id: index,
            from: msg.from, // "user" ou "bot"
            text: msg.text
        }));
        
        return formattedHistory;
      } else {
        console.error("❌ Erro no fetch histórico:", response.status, await response.text());
        return [];
      }
    } catch (error) {
      console.error("❌ Erro de rede ao buscar histórico:", error);
      return [];
    }
  }, [user]);

  const askChatbot = async (message: string): Promise<string> => {
    try {
      if (!user?.id) throw new Error("User not found");
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id, message }),
      });

      if (!response.ok) {
          const errText = await response.text();
          console.error("Erro API Chatbot:", errText);
          throw new Error("Error calling chatbot");
      }
      
      const data = await response.json();
      return data.answer;
    } catch (err: any) {
        throw err;
    }
  };

  return (
    <ApiContext.Provider value={{ askChatbot, getHistory }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used inside ApiProvider");
  return ctx;
}