"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext"; 
import type { Goal } from "@/types/Goal";

const API_URL = "http://localhost:8080"; 

const CATEGORY_MAP = {
    career: { id: 1, description: "Career" },
    skill: { id: 2, description: "Skill" },
    milestone: { id: 3, description: "Milestone" }
};

const STATUS_MAP = {
    todo: { id: 1, description: "To Do" },
    "in-progress": { id: 2, description: "In Progress" },
    completed: { id: 3, description: "Completed" }
};

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMilestone, setCurrentMilestone] = useState<string | null>(null);

  const getToken = () => localStorage.getItem("token");

  // --- 1. LISTAR METAS (GET) ---
  const fetchGoals = useCallback(async () => {
    if (!user || !user.id) return;
    
    try {
      const token = getToken();
      console.log("🔄 Fetching goals for UserID:", user.id); // DEBUG

      const response = await fetch(`${API_URL}/goals?userId=${user.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store'
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📦 Dados recebidos do Java:", data); // DEBUG: Veja isso no console do navegador!

        // Lógica robusta para extrair a lista, seja Page ou List
        let lista: any[] = [];
        
        // Caso 1: PagedModel do HATEOAS (Spring HATEOAS retorna {_embedded: { goalList: [...] } })
        if (data._embedded && data._embedded.goalList) {
            lista = data._embedded.goalList;
        } 
        // Caso 2: PageImpl padrão do Spring (retorna { content: [...] })
        else if (data.content && Array.isArray(data.content)) {
            lista = data.content;
        } 
        // Caso 3: Lista direta ([...])
        else if (Array.isArray(data)) {
            lista = data;
        }

        console.log("📋 Lista extraída:", lista); // DEBUG

        const normalizedGoals = lista.map((g: any) => ({
            ...g,
            // Garante que category e status sejam strings minúsculas para o front
            category: normalizeCategory(g.category),
            status: normalizeStatus(g.status)
        }));

        setGoals(normalizedGoals);
      } else {
        console.error("❌ Erro no fetch:", response.status, await response.text());
      }
    } catch (error) {
      console.error("❌ Erro de rede ao buscar metas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // --- AUXILIARES ---
  const normalizeCategory = (catObj: any): "career" | "skill" | "milestone" => {
      if (!catObj) return "career";
      // Se vier objeto {id: 1, description: "Career"}
      if (typeof catObj === 'object' && catObj.description) {
          const desc = catObj.description.toLowerCase();
          if (desc.includes("skill")) return "skill";
          if (desc.includes("milestone")) return "milestone";
      }
      // Se vier string "CAREER"
      if (typeof catObj === 'string') {
          const s = catObj.toLowerCase();
          if (s.includes("skill")) return "skill";
          if (s.includes("milestone")) return "milestone";
      }
      return "career";
  };

  const normalizeStatus = (statusObj: any): "todo" | "in-progress" | "completed" => {
      if (!statusObj) return "todo";
      if (typeof statusObj === 'object' && statusObj.description) {
          const desc = statusObj.description.toLowerCase();
          if (desc.includes("progress")) return "in-progress";
          if (desc.includes("complet")) return "completed";
      }
      if (typeof statusObj === 'string') {
          const s = statusObj.toLowerCase();
          if (s.includes("progress")) return "in-progress";
          if (s.includes("complet")) return "completed";
      }
      return "todo";
  };

  // --- 2. CRIAR META (POST) ---
  const addGoal = async (goalData: Omit<Goal, "id">) => {
    if (!user?.id) return;

    try {
      const token = getToken();
      
      const categoryObj = CATEGORY_MAP[goalData.category] || CATEGORY_MAP.career;
      const statusObj = STATUS_MAP[goalData.status] || STATUS_MAP.todo;

      const payload = {
        title: goalData.title,
        description: goalData.description,
        category: categoryObj,
        status: statusObj,
      };

      const response = await fetch(`${API_URL}/goals?userId=${user.id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("✅ Meta criada com sucesso!");
        await fetchGoals(); // Recarrega a lista do servidor
        checkAchievements("created");
      } else {
        const errorTxt = await response.text();
        console.error("❌ Erro no backend ao criar meta:", errorTxt);
      }
    } catch (error) {
      console.error("❌ Erro de conexão:", error);
    }
  };

  // --- 3. ATUALIZAR META (PUT) ---
  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const token = getToken();
      const currentGoal = goals.find(g => g.id === id);
      if(!currentGoal) return;

      const mergedFront = { ...currentGoal, ...updates };
      const categoryObj = CATEGORY_MAP[mergedFront.category];
      const statusObj = STATUS_MAP[mergedFront.status];

      const payload = {
          id: mergedFront.id,
          title: mergedFront.title,
          description: mergedFront.description,
          category: categoryObj,
          status: statusObj
      };

      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchGoals(); // Recarrega para garantir dados frescos
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  // --- 4. DELETAR META (DELETE) ---
  const deleteGoal = async (id: string) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/goals/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setGoals((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const toggleGoalStatus = async (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    const nextStatus = goal.status === "todo" ? "in-progress" : goal.status === "in-progress" ? "completed" : "todo";
    
    // Otimista
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status: nextStatus } : g));
    
    await updateGoal(id, { status: nextStatus });

    if (nextStatus === "completed") {
      checkAchievements("completed");
    }
  };

  const checkAchievements = (action: "created" | "completed") => {
    if (action === "completed") {
      setCurrentMilestone("Meta concluída! Continue assim! 🚀");
    }
  };

  const dismissMilestone = () => setCurrentMilestone(null);

  return {
    goals,
    isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleGoalStatus,
    currentMilestone,
    dismissMilestone,
  };
}