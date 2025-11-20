"use client";

import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

interface ApiContextType {
  askChatbot: (message: string) => Promise<string>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

// URL específica para o endpoint do chatbot
const API_URL = "http://localhost:8080/api/chatbot"; // desenvolvimento local
// const API_URL = "http://172.172.112.144:8000/api/chatbot"; // production

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const askChatbot = async (message: string): Promise<string> => {
    try {
      if (!user?.id) {
        console.error("Usuário não autenticado — userId ausente");
        return "Erro: usuário não autenticado ou sessão expirada.";
      }

      // Pega o token atualizado do storage na hora da requisição
      const token = localStorage.getItem("token");

      if (!token) {
        return "Erro: Sessão expirada. Faça login novamente.";
      }

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
        // Tenta capturar erro específico do backend (ex: 401, 400)
        let errorMsg = "Erro ao chamar o chatbot";
        try {
            const errData = await response.json();
            // Se o backend retornar um erro JSON, usamos ele (ex: "Erro 401: ...")
            if(errData.error || errData.message) {
                errorMsg = errData.message || errData.error;
            }
        } catch(e) {}
        
        throw new Error(errorMsg);
      }

      const data = await response.json();
      return data.answer;
      
    } catch (err: any) {
      console.error("Erro no chatbot:", err);
      // Retorna a mensagem de erro limpa para o chat
      return err.message || "Erro ao conectar ao servidor.";
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