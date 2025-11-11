import { Sparkles } from "lucide-react"

export function MascotMessage() {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-6 mb-8 border border-primary/20">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground">Olá! Sou a NOVA</h3>
          <p className="text-muted-foreground leading-relaxed">
            Aqui você encontra dicas práticas e motivacionais para impulsionar sua carreira. Cada conselho foi
            cuidadosamente selecionado para ajudar você em diferentes momentos da sua jornada profissional. Explore,
            aprenda e cresça!
          </p>
        </div>
      </div>
    </div>
  )
}
