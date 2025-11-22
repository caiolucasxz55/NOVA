"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext"; 
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMilestone, setCurrentMilestone] = useState<string | null>(null);

  const getToken = () => localStorage.getItem("token");

  const handleUnauthorized = () => {
      console.warn("🔒 Sessão expirada ou token inválido (401). Redirecionando...");
      localStorage.removeItem("token");
      router.push("/login");
  };

  const normalizeCategory = (catObj: any): "career" | "skill" | "milestone" => {
      if (!catObj) return "career";
      if (typeof catObj === 'object' && catObj.description) {
          const desc = catObj.description.toLowerCase();
          if (desc.includes("skill")) return "skill";
          if (desc.includes("milestone")) return "milestone";
      }
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

  const fetchGoals = useCallback(async () => {
    if (!user || !user.id) return;
    
    const token = getToken();

    if (!token) {
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_URL}/goals?userId=${user.id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store'
      });

      if (response.status === 401) {
         handleUnauthorized();
         return;
      }

      if (response.ok) {
        const data = await response.json();
        let lista: any[] = [];
        
        if (data._embedded && data._embedded.goalList) {
            lista = data._embedded.goalList;
        } 
        else if (data.content && Array.isArray(data.content)) {
            lista = data.content;
        } 
        else if (Array.isArray(data)) {
            lista = data;
        }

        const normalizedGoals = lista.map((g: any) => ({
            ...g,
            category: normalizeCategory(g.category),
            status: normalizeStatus(g.status)
        }));

        setGoals(normalizedGoals);
      } else {
        console.error("Erro API:", response.status);
      }
    } catch (error) {
      console.error("Erro Rede:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const checkAchievements = (action: "created" | "completed") => {
    if (action === "completed") {
      setCurrentMilestone("Meta concluída! Continue assim! 🚀");
    }
  };

  const addGoal = async (goalData: Omit<Goal, "id">) => {
    if (!user?.id) return;

    try {
      const token = getToken();
      if (!token) return;

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

      if (response.status === 401) {
          handleUnauthorized();
          return;
      }

      if (response.ok) {
        await fetchGoals();
        checkAchievements("created");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!user?.id) return;

    try {
      const token = getToken();
      if (!token) return;

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

      // CORREÇÃO: Adicionado ?userId=...
      const response = await fetch(`${API_URL}/goals/${id}?userId=${user.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
          handleUnauthorized();
          return;
      }

      if (response.ok) {
        await fetchGoals();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGoal = async (id: string) => {
    if (!user?.id) return;

    try {
      const token = getToken();
      if (!token) return;

      // CORREÇÃO: Adicionado ?userId=...
      const response = await fetch(`${API_URL}/goals/${id}?userId=${user.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
          handleUnauthorized();
          return;
      }

      if (response.ok) {
        setGoals((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleGoalStatus = async (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;

    const nextStatus = goal.status === "todo" ? "in-progress" : goal.status === "in-progress" ? "completed" : "todo";
    
    // Atualização Otimista
    setGoals(prev => prev.map(g => g.id === id ? { ...g, status: nextStatus } : g));
    
    await updateGoal(id, { status: nextStatus });

    if (nextStatus === "completed") {
      checkAchievements("completed");
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