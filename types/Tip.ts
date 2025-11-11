export interface CareerTip {
  id: string
  title: string
  content: string
  category: "interview" | "skills" | "networking" | "career-change" | "first-job"
  icon: string
}
