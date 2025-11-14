"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SkillsManager } from "@/components/profile/skills-manager";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Target, Briefcase, Save, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, updateProfile, logout, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([]);
  const [careerObjective, setCareerObjective] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setSkills(user.skills || []);
      setCareerObjective(user.careerObjective || "");
    }
  }, [user]);

  const handleSave = () => {
    updateProfile({ skills, careerObjective });
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading || !user) return null;

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* ---------------- MODERN PROFILE CARD ---------------- */}
          <Card className="overflow-hidden shadow-lg border-2">
            <div className="bg-gradient-to-r from-primary/90 to-primary p-8 flex items-center justify-between">
              
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {initials}
                </div>

                <div className="text-white">
                  <h1 className="text-3xl font-semibold">{user.name}</h1>
                  <p className="opacity-90">{user.email}</p>
                </div>
              </div>

              {/* Logout */}
              <Button variant="secondary" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>

            {/* Subinfo */}
            <CardContent className="py-4 px-6">
              <p className="text-muted-foreground">
                Bem-vindo ao seu painel de perfil. Gerencie suas habilidades e objetivos de carreira para melhorar sua jornada profissional.
              </p>
            </CardContent>
          </Card>

          {/* ---------------- CARD HABILIDADES ---------------- */}
          <Card className="border-2 shadow-sm">
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

          {/* ---------------- CARD OBJETIVO DE CARREIRA ---------------- */}
          <Card className="border-2 shadow-sm">
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

          {/* ---------------- BOTÃO SALVAR ---------------- */}
          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg" className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Alterações
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
