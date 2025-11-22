"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SkillsManagerProps {
  skills: string[]
  onSkillsChange: (skills: string[]) => void
}

export function SkillsManager({ skills, onSkillsChange }: SkillsManagerProps) {
  const [newSkill, setNewSkill] = useState("")
  const [skillType, setSkillType] = useState<"HARD" | "SOFT">("HARD")

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      // Formato: "nome|tipo" para enviar ao backend depois
      const skillWithType = `${newSkill.trim()}|${skillType}`
      onSkillsChange([...skills, skillWithType])
      setNewSkill("")
      setSkillType("HARD")
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
        <Select value={skillType} onValueChange={(v) => setSkillType(v as "HARD" | "SOFT")}>
          <SelectTrigger className="w-[130px] cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HARD" className="cursor-pointer">Hard Skill</SelectItem>
            <SelectItem value="SOFT" className="cursor-pointer">Soft Skill</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={addSkill} size="icon" disabled={!newSkill.trim()} className="cursor-pointer">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma habilidade adicionada ainda.</p>
        ) : (
          skills.map((skill) => {
            // Divide "nome|tipo" ou só "nome" se for skill antiga
            const [skillName, skillTypeTag] = skill.includes("|") ? skill.split("|") : [skill, "HARD"]
            const isHard = skillTypeTag === "HARD"
            
            return (
              <Badge 
                key={skill} 
                variant="secondary" 
                className={`px-3 py-1.5 text-sm gap-2 ${isHard ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-purple-100 text-purple-800 border-purple-200'}`}
              >
                <span className="font-medium">{skillName}</span>
                <span className="text-xs opacity-70">({isHard ? 'Hard' : 'Soft'})</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:text-destructive transition-colors cursor-pointer"
                  aria-label={`Remover ${skillName}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })
        )}
      </div>
    </div>
  )
}
