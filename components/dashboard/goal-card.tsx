"use client"

import type { Goal } from "@/types/Goal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, CheckCircle2, Circle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}

const categoryColors = {
  career: "bg-primary/10 text-primary border-primary/20",
  skill: "bg-secondary/30 text-secondary-foreground border-secondary/40",
  milestone: "bg-accent/50 text-accent-foreground border-accent/60",
}

const categoryLabels = {
  career: "Carreira",
  skill: "Habilidade",
  milestone: "Marco",
}

const statusIcons = {
  todo: Circle,
  "in-progress": Clock,
  completed: CheckCircle2,
}

const statusLabels = {
  todo: "A fazer",
  "in-progress": "Em progresso",
  completed: "Concluído",
}

const statusColors = {
  todo: "text-muted-foreground",
  "in-progress": "text-blue-500",
  completed: "text-green-500",
}

export function GoalCard({ goal, onEdit, onDelete, onToggleStatus }: GoalCardProps) {
  const StatusIcon = statusIcons[goal.status]

  return (
    <div className="relative rounded-[calc(var(--radius)+4px)] p-[2px] bg-gradient-to-r from-blue-400 via-blue-600 to-blue-500 animate-gradient">
      <Card className="group hover:shadow-lg transition-all duration-200 bg-card border-0 relative">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-6 w-6", statusColors[goal.status])}
                  onClick={() => onToggleStatus(goal.id)}
                >
                  <StatusIcon className="h-5 w-5" />
                </Button>
                <CardTitle
                  className={cn("text-lg", goal.status === "completed" && "line-through text-muted-foreground")}
                >
                  {goal.title}
                </CardTitle>
              </div>
              <Badge variant="outline" className={cn("w-fit", categoryColors[goal.category])}>
                {categoryLabels[goal.category]}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                onClick={() => onEdit(goal)}
                title="Editar meta"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(goal.id)}
                title="Deletar meta"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {goal.description && (
          <CardContent>
            <CardDescription className="leading-relaxed">{goal.description}</CardDescription>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
