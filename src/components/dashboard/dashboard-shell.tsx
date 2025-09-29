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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
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
                {title && <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>}
                {description && (
                  <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">{description}</p>
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
  )
}

