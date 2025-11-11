"use client"

import { useState, useEffect } from "react"
import type { Goal } from "@/types/Goal"
import { useAuth } from "@/contexts/AuthContext"

export function useGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [completedMilestones, setCompletedMilestones] = useState<number[]>([])
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null)

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`nova_goals_${user.id}`)
      const milestonesStored = localStorage.getItem(`nova_milestones_${user.id}`)
      if (stored) {
        setGoals(JSON.parse(stored))
      }
      if (milestonesStored) {
        setCompletedMilestones(JSON.parse(milestonesStored))
      }
    }
  }, [user])

  const saveGoals = (newGoals: Goal[]) => {
    if (user) {
      setGoals(newGoals)
      localStorage.setItem(`nova_goals_${user.id}`, JSON.stringify(newGoals))
    }
  }

  const checkMilestones = (newGoals: Goal[]) => {
    const completedCount = newGoals.filter((g) => g.status === "completed").length
    const milestones = [3, 5, 10]

    for (const milestone of milestones) {
      if (completedCount >= milestone && !completedMilestones.includes(milestone)) {
        setCurrentMilestone(milestone)
        const updatedMilestones = [...completedMilestones, milestone]
        setCompletedMilestones(updatedMilestones)
        if (user) {
          localStorage.setItem(`nova_milestones_${user.id}`, JSON.stringify(updatedMilestones))
        }
        break
      }
    }
  }

  const addGoal = (goal: Omit<Goal, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (user) {
      const newGoal: Goal = {
        ...goal,
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      saveGoals([...goals, newGoal])
    }
  }

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const updated = goals.map((goal) => (goal.id === id ? { ...goal, ...updates, updatedAt: new Date() } : goal))
    saveGoals(updated)
    checkMilestones(updated)
  }

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter((goal) => goal.id !== id))
  }

  const toggleGoalStatus = (id: string) => {
    const goal = goals.find((g) => g.id === id)
    if (goal) {
      const statusOrder: Goal["status"][] = ["todo", "in-progress", "completed"]
      const currentIndex = statusOrder.indexOf(goal.status)
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
      updateGoal(id, { status: nextStatus })
    }
  }

  const dismissMilestone = () => {
    setCurrentMilestone(null)
  }

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleGoalStatus,
    currentMilestone,
    dismissMilestone,
  }
}
