"use client"

import { useEffect, useState } from "react"
import { X, Trophy, Sparkles, Star, Crown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AchievementNotificationProps {
  milestone: number
  onClose: () => void
}

const milestoneData = {
  3: {
    icon: Star,
    title: "Primeiras Conquistas!",
    message: "Você completou 3 metas! Continue assim e alcançará seus sonhos!",
    gradient: "from-blue-500 to-cyan-500",
  },
  5: {
    icon: Sparkles,
    title: "Está Arrasando!",
    message: "5 metas concluídas! Seu esforço está gerando resultados incríveis!",
    gradient: "from-blue-600 to-purple-500",
  },
  10: {
    icon: Crown,
    title: "Você é Incrível!",
    message: "WOW! 10 metas concluídas! Você está construindo uma carreira de sucesso!",
    gradient: "from-amber-500 to-orange-600",
  },
}

export function AchievementNotification({ milestone, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const data = milestoneData[milestone as keyof typeof milestoneData]
  const Icon = data ? data.icon : null

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  if (!data) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <Card
        className={cn(
          "relative w-full max-w-md border-0 shadow-2xl overflow-hidden",
          "animate-in zoom-in-95 slide-in-from-bottom-4 duration-500",
          !isVisible && "animate-out zoom-out-95 fade-out duration-300",
        )}
      >
        {/* Gradient background */}
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10", data.gradient)} />

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full hover:bg-background/80"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="relative p-8 text-center space-y-4">
          {/* Icon with animation */}
          {Icon && (
            <div className="flex justify-center">
              <div className={cn("p-4 rounded-full bg-gradient-to-br shadow-lg animate-pulse", data.gradient)}>
                <Icon className="h-12 w-12 text-white" />
              </div>
            </div>
          )}

          {/* Trophy count */}
          <div className="flex items-center justify-center gap-2">
            <Trophy className={cn("h-6 w-6 bg-gradient-to-br bg-clip-text text-transparent", data.gradient)} />
            <span className="text-4xl font-bold">{milestone}</span>
            <Trophy className={cn("h-6 w-6 bg-gradient-to-br bg-clip-text text-transparent", data.gradient)} />
          </div>

          {/* Title and message */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">{data.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{data.message}</p>
          </div>

          {/* Action button */}
          <Button
            onClick={handleClose}
            className={cn("w-full mt-4 bg-gradient-to-r text-white shadow-lg", data.gradient)}
            size="lg"
          >
            Continuar Crescendo
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
