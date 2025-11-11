import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { Sparkles } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-yellow-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-card-foreground">Bem-vindo de volta</h1>
            <p className="text-muted-foreground">Entre para continuar sua jornada profissional</p>
          </div>

          <LoginForm />

          <div className="text-center text-sm text-muted-foreground">
            Ainda não tem uma conta?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Criar conta grátis
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
