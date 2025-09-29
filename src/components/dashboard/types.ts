import { LucideIcon } from "lucide-react"

export type UserRole = "admin" | "speaker" | "attendee"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

