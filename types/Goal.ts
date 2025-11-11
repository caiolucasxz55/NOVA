export interface Goal {
  id: string
  userId: string
  title: string
  description: string
  category: "career" | "skill" | "milestone"
  status: "todo" | "in-progress" | "completed"
  createdAt: Date
  updatedAt: Date
}
