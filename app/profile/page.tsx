"use client"

import { useAuth } from "@/contexts/AuthContext"
import { DashboardNavbar } from "@/components/dashboard/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { SkillsManager } from "@/components/profile/skills-manager"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Target, Briefcase, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [skills, setSkills] = useState<string[]>([])
  const [careerObjective, setCareerObjective] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      setSkills(user.skills || [])
      setCareerObjective(user.careerObjective || "")
    }
  }, [user])

  const handleSave = () => {
    updateProfile({ skills, careerObjective })
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    })
  }

  if (isLoading) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
              <p className="text-muted-foreground">Gerencie suas informações profissionais</p>
            </div>
          </div>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <CardTitle>Habilidades</CardTitle>
              </div>
              <CardDescription>Adicione suas habilidades técnicas e soft skills</CardDescription>
            </CardHeader>
            <CardContent>
              <SkillsManager skills={skills} onSkillsChange={setSkills} />
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Objetivo de Carreira</CardTitle>
              </div>
              <CardDescription>Descreva seus objetivos e aspirações profissionais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="career-objective">Seu objetivo</Label>
                <Textarea
                  id="career-objective"
                  placeholder="Ex: Quero me tornar um desenvolvedor sênior especializado em aplicações web modernas..."
                  value={careerObjective}
                  onChange={(e) => setCareerObjective(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Seja específico sobre onde você quer chegar na sua carreira
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg" className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
