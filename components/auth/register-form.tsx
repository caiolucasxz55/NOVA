"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [careerObjective, setCareerObjective] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await register(name, email, password, careerObjective);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Registration failed:", error);
      setErrorMessage(
        error?.message || "Não foi possível criar sua conta. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <p className="text-sm text-red-500 border border-red-300 bg-red-50 p-2 rounded">
          {errorMessage}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="careerObjective">Objetivo de Carreira</Label>
        <Input
          id="careerObjective"
          type="text"
          placeholder="Ex: Desenvolvedor Full Stack"
          value={careerObjective}
          onChange={(e) => setCareerObjective(e.target.value)}
          required
          className="h-12"
        />
      </div>

      <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
        {isLoading ? (
          "Criando conta..."
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Começar com NOVA
          </>
        )}
      </Button>
    </form>
  );
}
