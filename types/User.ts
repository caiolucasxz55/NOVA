export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  goals: string[]
  skills: string[]
  careerObjective: string
  createdAt: Date
  role: string            // ✅ novo campo
}
