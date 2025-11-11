"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface SkillsManagerProps {
  skills: string[]
  onSkillsChange: (skills: string[]) => void
}

export function SkillsManager({ skills, onSkillsChange }: SkillsManagerProps) {
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onSkillsChange([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Digite uma habilidade..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={addSkill} size="icon" disabled={!newSkill.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma habilidade adicionada ainda.</p>
        ) : (
          skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-sm gap-2">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="hover:text-destructive transition-colors"
                aria-label={`Remover ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  )
}
