"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se terminou de carregar (isLoading false) e NÃO tem usuário logado
    if (!isLoading && !user) {
      console.warn("Acesso não autorizado. Redirecionando para login...");
      router.push("/"); // Redireciona para a Home/Login (Ajuste se sua rota de login for /login)
    }
  }, [user, isLoading, router]);

  // 1. Enquanto verifica o localStorage, mostra um loading para não piscar a tela errada
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-blue-600 animate-pulse">
          Verificando autenticação...
        </div>
      </div>
    );
  }

  // 2. Se não tiver usuário (e já estiver redirecionando), não renderiza nada do conteúdo protegido
  if (!user) {
    return null;
  }

  // 3. Se tiver usuário, libera o acesso aos filhos (a página do Chatbot)
  return <>{children}</>;
}