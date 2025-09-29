"use client"

import { ReactNode } from "react"
import { Sidebar, MobileSidebar } from "./nav"
import { Topbar } from "./topbar"
import { UserRole } from "./types"
import { DarkThemeProvider } from "./soft-ui/dark-theme"

export function DashboardShell({ role, children, title, description }: {
  role: UserRole
  children: ReactNode
  title?: string
  description?: string
}) {
  return (
    <DarkThemeProvider>
      <div className="min-h-screen w-full">
        <div className="lg:hidden px-2 pt-2">
          <MobileSidebar role={role} />
        </div>
        <div className="grid lg:grid-cols-[18rem_1fr]">
          <Sidebar role={role} />
          <div className="flex flex-col min-h-screen">
            <Topbar />
            <main className="flex-1 p-6 space-y-8">
              {(title || description) && (
                <header className="space-y-2">
                  {title && <h1 className="text-3xl font-bold tracking-tight text-gray-100">{title}</h1>}
                  {description && (
                    <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">{description}</p>
                  )}
                </header>
              )}
              <div className="space-y-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </DarkThemeProvider>
  )
}

