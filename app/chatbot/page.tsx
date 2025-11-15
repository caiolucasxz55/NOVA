"use client";

import React, { FormEvent, useRef, useState } from "react";
import { useApi, ApiProvider } from "../../contexts/ApiContext";

type Message = { id: number; from: "user" | "bot"; text: string };

function Chatbot() {
  const { askChatbot } = useApi();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Apenas gera IDs incrementais para renderização
  const localIdRef = useRef(0);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();

    const text = input.trim();
    if (!text) return;

    // Mensagem do usuário na tela
    const userMsgId = ++localIdRef.current;
    setMessages((prev) => [...prev, { id: userMsgId, from: "user", text }]);

    setInput("");
    setLoading(true);

    try {
      // Chama o backend (já envia userId automaticamente)
      const reply = await askChatbot(text);

      const botMsgId = ++localIdRef.current;
      setMessages((prev) => [
        ...prev,
        { id: botMsgId, from: "bot", text: reply },
      ]);
    } catch (err) {
      const botMsgId = ++localIdRef.current;
      setMessages((prev) => [
        ...prev,
        { id: botMsgId, from: "bot", text: "Erro ao enviar mensagem." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Chatbot</h1>

      <div className="border rounded-md p-4 mb-4 h-80 overflow-auto bg-white">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma mensagem. Pergunte algo!</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`mb-3 flex ${
                m.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[70%] ${
                  m.from === "user"
                    ? "bg-sky-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={send} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={loading ? "Processando..." : "Digite sua mensagem..."}
          disabled={loading}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 text-white rounded"
          disabled={loading || input.trim() === ""}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}

export default function ChatbotPage() {
  return (
    <ApiProvider>
      <Chatbot />
    </ApiProvider>
  );
}
