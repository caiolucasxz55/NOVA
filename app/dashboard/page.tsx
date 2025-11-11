"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useGoals } from "@/hooks/use-goals"
import type { Goal } from "@/types/Goal"
import { DashboardNavbar } from "@/components/dashboard/navbar"
import { GoalCard } from "@/components/dashboard/goal-card"
import { GoalDialog } from "@/components/dashboard/goal-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { AchievementNotification } from "@/components/dashboard/achievement-notification"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, CheckCircle2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { goals, addGoal, updateGoal, deleteGoal, toggleGoalStatus, currentMilestone, dismissMilestone } = useGoals()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleOpenDialog = (goal?: Goal) => {
    setEditingGoal(goal || null)
    setDialogOpen(true)
  }

  const handleSaveGoal = (goalData: Omit<Goal, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData)
    } else {
      addGoal(goalData)
    }
  }

  const handleDeleteClick = (id: string) => {
    setGoalToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (goalToDelete) {
      deleteGoal(goalToDelete)
      setGoalToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const activeGoals = goals.filter((g) => g.status !== "completed")
  const completedGoals = goals.filter((g) => g.status === "completed")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/20 to-yellow-50/20">
      <DashboardNavbar />

      {currentMilestone && <AchievementNotification milestone={currentMilestone} onClose={dismissMilestone} />}

      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Olá, {user.name}!</h1>
          </div>
          <p className="text-lg text-muted-foreground">Continue construindo sua jornada profissional</p>
        </div>

        {goals.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-5 duration-700">
            <StatsCards goals={goals} />
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Minhas Metas</h2>
          <Button onClick={() => handleOpenDialog()} size="lg" className="gap-2 hidden md:flex">
            <Plus className="h-5 w-5" />
            Nova Meta
          </Button>
        </div>

        {goals.length === 0 ? (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <EmptyState onCreateClick={() => handleOpenDialog()} />
          </div>
        ) : (
          <div className="space-y-12">
            {activeGoals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Em Andamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeGoals.map((goal, index) => (
                    <div
                      key={goal.id}
                      className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <GoalCard
                        goal={goal}
                        onEdit={handleOpenDialog}
                        onDelete={handleDeleteClick}
                        onToggleStatus={toggleGoalStatus}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedGoals.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-semibold text-foreground">Concluídas ({completedGoals.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedGoals.map((goal, index) => (
                    <div
                      key={goal.id}
                      className="animate-in fade-in slide-in-from-bottom-2 duration-500 opacity-75"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <GoalCard
                        goal={goal}
                        onEdit={handleOpenDialog}
                        onDelete={handleDeleteClick}
                        onToggleStatus={toggleGoalStatus}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {goals.length > 0 && <FloatingActionButton onClick={() => handleOpenDialog()} />}

        <GoalDialog open={dialogOpen} onOpenChange={setDialogOpen} onSave={handleSaveGoal} goal={editingGoal} />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A meta será permanentemente removida.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
