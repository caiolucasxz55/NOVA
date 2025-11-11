"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { DashboardNavbar } from "@/components/dashboard/navbar"
import { TipCard } from "@/components/tips/tip-card"
import { FilterTabs } from "@/components/tips/filter-tabs"
import { MascotMessage } from "@/components/tips/mascot-message"
import { Button } from "@/components/ui/button"
import { mockCareerTips, getRandomRecommendations } from "@/lib/mock-data"
import type { CareerTip } from "@/types/Tip"
import { RefreshCw, Lightbulb } from "lucide-react"

export default function TipsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<CareerTip["category"] | "all">("all")
  const [displayedTips, setDisplayedTips] = useState<CareerTip[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    loadTips()
  }, [activeFilter])

  const loadTips = () => {
    const filtered =
      activeFilter === "all" ? mockCareerTips : mockCareerTips.filter((tip) => tip.category === activeFilter)

    // Show 6 random tips from the filtered set
    const randomTips = getRandomRecommendations(filtered, Math.min(6, filtered.length))
    setDisplayedTips(randomTips)
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/20 to-yellow-50/20">
      <DashboardNavbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Dicas de Carreira</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Conselhos práticos para cada etapa da sua jornada profissional
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-top-5 duration-700">
          <MascotMessage />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <Button
            variant="outline"
            size="icon"
            onClick={loadTips}
            className="rounded-full shrink-0 bg-transparent"
            title="Atualizar dicas"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Tips Grid */}
        {displayedTips.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Nenhuma dica encontrada para esta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTips.map((tip, index) => (
              <div
                key={tip.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TipCard tip={tip} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
