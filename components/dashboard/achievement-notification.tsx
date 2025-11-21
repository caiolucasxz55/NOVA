"use client"

import { useEffect } from "react"
import { X, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface AchievementNotificationProps {
  milestone: string // <--- CORREÇÃO: Mudamos de number para string
  onClose: () => void
}

export function AchievementNotification({ milestone, onClose }: AchievementNotificationProps) {
  // Fecha automaticamente após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <Card className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-200 shadow-lg p-4 flex items-center gap-4 max-w-md">
        <div className="bg-yellow-500/20 p-2 rounded-full">
          <Trophy className="h-6 w-6 text-yellow-700" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-yellow-900">Parabéns! 🎉</h4>
          <p className="text-sm text-yellow-800">{milestone}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="h-6 w-6 text-yellow-700 hover:text-yellow-900 hover:bg-yellow-200/50"
        >
          <X className="h-4 w-4" />
        </Button>
      </Card>
    </div>
  )
}