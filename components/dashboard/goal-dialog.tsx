"use client"

import { useState, useEffect } from "react"
import type { Goal } from "@/types/Goal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (goal: Omit<Goal, "id" | "userId" | "createdAt" | "updatedAt">) => void
  goal?: Goal | null
}

export function GoalDialog({ open, onOpenChange, onSave, goal }: GoalDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<Goal["category"]>("career")
  const [status, setStatus] = useState<Goal["status"]>("todo")

  useEffect(() => {
    if (goal) {
      setTitle(goal.title)
      setDescription(goal.description)
      setCategory(goal.category)
      setStatus(goal.status)
    } else {
      setTitle("")
      setDescription("")
      setCategory("career")
      setStatus("todo")
    }
  }, [goal, open])

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title, description, category, status })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{goal ? "Editar Meta" : "Nova Meta"}</DialogTitle>
          <DialogDescription>
            {goal
              ? "Atualize os detalhes da sua meta profissional"
              : "Defina uma nova meta para sua jornada profissional"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título*</Label>
            <Input
              id="title"
              placeholder="Ex: Aprender React avançado"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva sua meta em mais detalhes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Goal["category"])}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="career">Carreira</SelectItem>
                  <SelectItem value="skill">Habilidade</SelectItem>
                  <SelectItem value="milestone">Marco</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Goal["status"])}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">A fazer</SelectItem>
                  <SelectItem value="in-progress">Em progresso</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()} className="cursor-pointer">
            {goal ? "Salvar" : "Criar Meta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
