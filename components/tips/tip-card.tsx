import type { CareerTip } from "@/types/Tip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TipCardProps {
  tip: CareerTip
}

const categoryLabels = {
  interview: "Entrevistas",
  skills: "Habilidades",
  networking: "Networking",
  "career-change": "Mudança de Carreira",
  "first-job": "Primeiro Emprego",
}

const categoryColors = {
  interview: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  skills: "bg-green-500/10 text-green-700 border-green-500/20",
  networking: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  "career-change": "bg-orange-500/10 text-orange-700 border-orange-500/20",
  "first-job": "bg-pink-500/10 text-pink-700 border-pink-500/20",
}

export function TipCard({ tip }: TipCardProps) {
  return (
    <Card className="h-full hover:shadow-md transition-all duration-200 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <span className="text-3xl">{tip.icon}</span>
          <Badge variant="outline" className={categoryColors[tip.category]}>
            {categoryLabels[tip.category]}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-tight pt-2">{tip.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{tip.content}</p>
      </CardContent>
    </Card>
  )
}
