"use client"

import { Target } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onCreateClick: () => void
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Target className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">Nenhuma meta ainda</h3>
      <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
        Comece sua jornada profissional criando sua primeira meta. Defina objetivos claros e acompanhe seu progresso.
      </p>
      <Button size="lg" onClick={onCreateClick} className="cursor-pointer">
        Criar Primeira Meta
      </Button>
    </div>
  )
}
