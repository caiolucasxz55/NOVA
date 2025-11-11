"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Target, TrendingUp, Award, ArrowRight, CheckCircle2 } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-yellow-50/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center backdrop-blur-sm bg-background/80 sticky top-0 z-50 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            NOVA
          </span>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost" size="lg" className="font-medium">
              Entrar
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              className="font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Começar Grátis
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/20 border border-primary/20 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Seu assistente de carreira inteligente
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Cresça profissionalmente com{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                NOVA
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
              Descubra novos caminhos, desenvolva suas habilidades e prepare-se para sua próxima oportunidade de
              carreira com orientação personalizada
            </p>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border-2 border-transparent bg-clip-padding shadow-lg">
              <div className="flex-shrink-0">
                <div className="relative h-16 w-16 rounded-full overflow-hidden ring-2 ring-primary/20">
                  <Image src="/images/nova-avatar.jpg" alt="NOVA AI Assistant" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Conheça NOVA</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sua consultora de carreira inteligente, pronta para ajudá-lo a alcançar seus objetivos profissionais
                  com dicas personalizadas e acompanhamento contínuo.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-medium shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg border-2 hover:bg-accent/50 bg-transparent"
                >
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
              <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur">
                <Image
                  src="/images/woman-career-ia.jpg"
                  alt="Career Growth Technology"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto mt-24 mb-32">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Por que escolher a <span className="text-primary">NOVA</span>?
            </h2>
            <p className="text-lg text-muted-foreground">
              Tudo que você precisa para impulsionar sua carreira em um só lugar
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              "Defina e acompanhe metas profissionais",
              "Receba dicas personalizadas para sua carreira",
              "Acesse recursos curados de aprendizado",
              "Conquiste badges de progresso",
              "Interface moderna e intuitiva",
              "100% gratuito para começar",
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:bg-card hover:border-primary/20 transition-all"
              >
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Funcionalidades que transformam carreiras
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas poderosas para você gerenciar e acelerar seu desenvolvimento profissional
            </p>
          </div>

          {/* Feature 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-flex h-12 w-12 rounded-xl bg-primary/10 items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">Defina e Acompanhe Metas</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Crie objetivos profissionais claros, organize por status e acompanhe seu progresso em tempo real.
                Celebre cada conquista com notificações motivacionais.
              </p>
              <ul className="space-y-3">
                {[
                  "Cards visuais com bordas animadas",
                  "Sistema de status (A Fazer, Em Progresso, Concluído)",
                  "Notificações de conquista em marcos importantes",
                  "Estatísticas de progresso em tempo real",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-border">
                <Image src="/images/sucess-growth.jpg" alt="Goals Management" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-border">
              <Image src="/images/tips-illustration.jpg" alt="Career Tips" fill className="object-cover" />
            </div>
            <div className="space-y-6">
              <div className="inline-flex h-12 w-12 rounded-xl bg-secondary/30 items-center justify-center">
                <TrendingUp className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">Dicas Personalizadas</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Receba orientações específicas da NOVA sobre entrevistas, networking, desenvolvimento de habilidades e
                muito mais. Conteúdo sempre atualizado e relevante.
              </p>
              <ul className="space-y-3">
                {[
                  "Filtros por categoria de interesse",
                  "Dicas práticas e acionáveis",
                  "Conteúdo rotativo para sempre algo novo",
                  "Mensagens motivacionais da NOVA",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary"></div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-flex h-12 w-12 rounded-xl bg-accent/50 items-center justify-center">
                <Award className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">Perfil Profissional Completo</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Construa seu perfil com suas habilidades, objetivos e conquistas. Tenha uma visão completa da sua
                jornada profissional e do quanto já avançou.
              </p>
              <ul className="space-y-3">
                {[
                  "Gerencie suas skills profissionais",
                  "Defina objetivos de longo prazo",
                  "Visualize seu progresso geral",
                  "Personalize sua experiência",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent"></div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-border">
                <Image
                  src="/images/resources-illustration.jpg"
                  alt="Professional Resources"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-32 mb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-12 shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative z-10 text-center space-y-8">
              <div className="flex justify-center">
                <div className="relative h-24 w-24 rounded-full overflow-hidden ring-4 ring-white/30 shadow-xl">
                  <Image src="/images/nova-avatar.jpg" alt="NOVA" fill className="object-cover" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Pronto para transformar sua carreira?
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Junte-se a profissionais que estão alcançando seus objetivos com a ajuda da NOVA
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-14 px-8 text-lg font-medium shadow-xl hover:shadow-2xl transition-all"
                  >
                    Começar Gratuitamente
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                NOVA
              </span>
            </div>
            <p className="text-muted-foreground text-center">© 2025 NOVA. Construído para impulsionar sua carreira.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
