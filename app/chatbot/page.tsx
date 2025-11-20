"use client";

import React, { FormEvent, useRef, useState, useEffect } from "react";
import { ApiProvider, useApi } from "@/contexts/ApiContext"; 
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Send, Bot, User as UserIcon, Loader2 } from "lucide-react"; 

type Message = {
  id: number;
  from: "user" | "bot";
  text: string;
};

function ChatbotInterface() {
  const { askChatbot } = useApi();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const localIdRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();

    const text = input.trim();
    if (!text) return;

    const userMsgId = ++localIdRef.current;
    setMessages((prev) => [...prev, { id: userMsgId, from: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askChatbot(text);
      const botMsgId = ++localIdRef.current;
      setMessages((prev) => [
        ...prev,
        { id: botMsgId, from: "bot", text: reply },
      ]);
    } catch (err) {
      const errorMsgId = ++localIdRef.current;
      setMessages((prev) => [
        ...prev,
        { id: errorMsgId, from: "bot", text: "Desculpe, tive um problema de conexão. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÃO DE FORMATAÇÃO ---
  // Transforma Markdown simples (**negrito**) em HTML e remove [1][2]
  const formatMessage = (text: string) => {
    // 1. Remove citações do tipo [1], [12], [1][2]
    let cleanText = text.replace(/\[\d+\]/g, "");

    // 2. Converte **texto** para <strong>texto</strong> (Negrito)
    // O regex captura o que está entre ** e envolve em tags strong
    const boldFormatted = cleanText.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return <>{boldFormatted}</>;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 mt-6">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center gap-3 text-white shadow-md">
        <div className="p-2 bg-white/20 rounded-full">
          <Bot size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold">Assistente NOVA</h1>
          <p className="text-xs text-blue-100">IA especialista em gestão de carreira</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <Bot size={48} className="mx-auto mb-2 opacity-50" />
            <p>Olá! Como posso ajudar na sua carreira hoje?</p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex w-full ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${
                m.from === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.from === "user" ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"
                }`}
              >
                {m.from === "user" ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>

              <div
                className={`px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap text-sm leading-relaxed ${
                  m.from === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                }`}
              >
                {/* AQUI APLICAMOS A FORMATAÇÃO */}
                {formatMessage(m.text)}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex justify-start w-full">
            <div className="flex items-center gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 text-white">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={send} className="flex gap-2 items-center">
          <input
            className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={loading}
          />

          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center justify-center"
            disabled={loading || input.trim() === ""}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ChatbotPage() {
  return (
    <ProtectedRoute>
      <ApiProvider>
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <ChatbotInterface />
        </div>
      </ApiProvider>
    </ProtectedRoute>
  );
}