"use client"

import { ReactNode } from "react"
import { Sidebar, MobileSidebar } from "./nav"
import { Topbar } from "./topbar"
import { UserRole } from "./types"

export function DashboardShell({ role, children, title, description }: {
  role: UserRole
  children: ReactNode
  title?: string
  description?: string
}) {
  return (
    <div className="min-h-[80vh] w-full">
      <div className="lg:hidden px-2 pt-2">
        <MobileSidebar role={role} />
      </div>
      <div className="grid lg:grid-cols-[16rem_1fr]">
        <Sidebar role={role} />
        <div className="flex flex-col">
          <Topbar />
          <main className="p-4 md:p-6 space-y-6">
            {(title || description) && (
              <header className="space-y-1">
                {title && <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>}
                {description && <p className="text-muted-foreground">{description}</p>}
              </header>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

