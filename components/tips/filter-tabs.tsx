"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CareerTip } from "@/types/Tip"

interface FilterTabsProps {
  activeFilter: CareerTip["category"] | "all"
  onFilterChange: (filter: CareerTip["category"] | "all") => void
}

const filters = [
  { value: "all" as const, label: "Todas" },
  { value: "interview" as const, label: "Entrevistas" },
  { value: "skills" as const, label: "Habilidades" },
  { value: "networking" as const, label: "Networking" },
  { value: "career-change" as const, label: "Mudança de Carreira" },
  { value: "first-job" as const, label: "Primeiro Emprego" },
]

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "default" : "outline"}
          onClick={() => onFilterChange(filter.value)}
          className={cn("rounded-full transition-all", activeFilter === filter.value && "shadow-md")}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  )
}
