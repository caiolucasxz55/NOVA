"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

// IMPORTS UI (SHADCN & LUCIDE)
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
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
import { Rocket, Target, Lightbulb, User, Sparkles, LogOut, Plus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// IMPORTS LOGICA
import { useAuth } from "@/contexts/AuthContext" 
import { useGoals } from "@/hooks/use-goals"
import type { Goal } from "@/types/Goal"

// IMPORTS COMPONENTES DASHBOARD
import { GoalCard } from "@/components/dashboard/goal-card"
import { GoalDialog } from "@/components/dashboard/goal-dialog"
import { EmptyState } from "@/components/dashboard/empty-state"
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { StatsCards } from "@/components/dashboard/stats-cards"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { AchievementNotification } from "@/components/dashboard/achievement-notification"


function Navbar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const initial = user?.name?.charAt(0).toUpperCase() || 'U';

  const linkStyle = cn(
    navigationMenuTriggerStyle(),
    "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 data-[active]:bg-gray-100 data-[active]:text-gray-900 px-3"
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
        
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">NOVA</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink asChild active={pathname === "/dashboard"}>
                  <Link href="/dashboard" className={linkStyle}>
                    <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                    NOVA
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild active={pathname === "/goals"}>
                  <Link href="/goals" className={linkStyle}>
                    <Target className="mr-2 h-4 w-4" />
                    Metas
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild active={pathname === "/tips"}>
                  <Link href="/tips" className={linkStyle}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Dicas
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild active={pathname === "/profile"}>
                  <Link href="/profile" className={linkStyle}>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center">
          <Menubar className="border-none bg-transparent shadow-none p-0 h-auto">
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer rounded-full p-0 focus:bg-transparent data-[state=open]:bg-transparent outline-none border-none">
                <div className="h-9 w-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold hover:bg-blue-700 transition-transform active:scale-95 shadow-sm border-2 border-transparent hover:border-blue-200">
                  {initial}
                </div>
              </MenubarTrigger>
              <MenubarContent align="end" className="mt-2">
                <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 border-b mb-1">
                  {user?.name || 'Usuário'}
                </div>
                <MenubarItem onClick={() => window.location.href = '/profile'} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </MenubarItem>
                <MenubarItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </header>
  )
}

// ==============================================================================
// 2. PÁGINA DASHBOARD (CONECTADA AO BACKEND)
// ==============================================================================
export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  // Hook agora usa fetch real
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) return null

  // --- CRUD HANDLERS ---
  const handleOpenDialog = (goal?: Goal) => {
    setEditingGoal(goal || null)
    setDialogOpen(true)
  }

  const handleSaveGoal = async (goalData: any) => {
    // goalData vem do form sem ID
    if (editingGoal) {
      await updateGoal(editingGoal.id, goalData)
    } else {
      await addGoal(goalData)
    }
    setDialogOpen(false)
  }

  const handleDeleteClick = (id: string) => {
    setGoalToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (goalToDelete) {
      await deleteGoal(goalToDelete)
      setGoalToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  // Filtros
  const activeGoals = goals.filter((g) => g.status !== "completed")
  const completedGoals = goals.filter((g) => g.status === "completed")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/20 to-yellow-50/20">
      
      <DashboardNavbar />

      {currentMilestone && <AchievementNotification milestone={currentMilestone} onClose={dismissMilestone} />}

      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8 max-w-7xl">
        
        {/* Header Boas Vindas */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-foreground">Olá, {user.name}!</h1>
          </div>
          <p className="text-lg text-muted-foreground">Continue construindo sua jornada profissional</p>
        </div>

        {/* Stats */}
        {goals.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-5 duration-700 mb-10">
            <StatsCards goals={goals} />
          </div>
        )}

        {/* Botão Nova Meta */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Minhas Metas</h2>
          <Button onClick={() => handleOpenDialog()} size="lg" className="gap-2 hidden md:flex bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
            <Plus className="h-5 w-5" />
            Nova Meta
          </Button>
        </div>

        {/* Listas */}
        {goals.length === 0 ? (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <EmptyState onCreateClick={() => handleOpenDialog()} />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Ativas */}
            {activeGoals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Em Andamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeGoals.map((goal, index) => (
                    <div key={goal.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
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

            {/* Concluídas */}
            {completedGoals.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mt-8">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-xl font-semibold text-foreground">Concluídas ({completedGoals.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedGoals.map((goal, index) => (
                    <div key={goal.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500 opacity-75" style={{ animationDelay: `${index * 50}ms` }}>
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

        {/* Mobile Fab */}
        {goals.length > 0 && <FloatingActionButton onClick={() => handleOpenDialog()} />}

        {/* Modais */}
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
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 text-white hover:bg-red-700">
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}