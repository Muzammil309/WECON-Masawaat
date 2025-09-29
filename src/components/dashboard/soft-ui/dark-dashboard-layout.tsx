"use client"

import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { DarkThemeProvider } from "./dark-theme"
import { UserRole } from "../types"

interface DarkDashboardLayoutProps {
  children: ReactNode
  role: UserRole
  title?: string
  description?: string
  className?: string
}

export function DarkDashboardLayout({ 
  children, 
  role, 
  title, 
  description, 
  className 
}: DarkDashboardLayoutProps) {
  return (
    <DarkThemeProvider>
      <div className={cn("min-h-screen flex", className)}>
        {/* Sidebar */}
        <DarkSidebar role={role} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <DarkTopbar />
          
          <main className="flex-1 p-6 space-y-8 overflow-auto">
            {(title || description) && (
              <header className="space-y-2">
                {title && (
                  <h1 className="text-3xl font-bold tracking-tight text-gray-100">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                    {description}
                  </p>
                )}
              </header>
            )}
            
            <div className="space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DarkThemeProvider>
  )
}

// Dark Theme Sidebar Component
interface DarkSidebarProps {
  role: UserRole
}

function DarkSidebar({ role }: DarkSidebarProps) {
  return (
    <aside className="w-72 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/30 shadow-2xl">
      {/* Logo Section */}
      <div className="h-16 px-6 flex items-center border-b border-gray-700/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-100 text-lg">WECON</h1>
            <p className="text-xs text-gray-400 -mt-1">Event Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          <DarkNavItem 
            icon="📊" 
            label="Dashboard" 
            href="/dashboard" 
            active={true}
          />
          <DarkNavItem 
            icon="🎫" 
            label="My Tickets" 
            href="/tickets" 
          />
          <DarkNavItem 
            icon="📅" 
            label="Schedule" 
            href="/schedule" 
          />
          <DarkNavItem 
            icon="⭐" 
            label="Recommendations" 
            href="/recommendations" 
          />
          <DarkNavItem 
            icon="👥" 
            label="Networking" 
            href="/networking" 
          />
          <DarkNavItem 
            icon="⚙️" 
            label="Settings" 
            href="/settings" 
          />
        </nav>

        {/* Role Badge */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl p-4 border border-gray-600/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">👤</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-100 capitalize">{role}</p>
                <p className="text-xs text-gray-400">Dashboard Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

// Dark Theme Navigation Item
interface DarkNavItemProps {
  icon: string
  label: string
  href: string
  active?: boolean
}

function DarkNavItem({ icon, label, href, active = false }: DarkNavItemProps) {
  return (
    <a
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative",
        active 
          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25" 
          : "text-gray-300 hover:text-gray-100 hover:bg-gray-800/60"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
        active 
          ? "bg-white/20 text-white" 
          : "bg-gray-800/60 text-gray-400 group-hover:bg-gray-700/60 group-hover:text-gray-200"
      )}>
        <span className="text-base">{icon}</span>
      </div>
      <span className="flex-1">{label}</span>
      {active && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
      )}
    </a>
  )
}

// Dark Theme Topbar Component
function DarkTopbar() {
  return (
    <div className="h-16 border-b border-gray-700/30 bg-gray-900/60 backdrop-blur-xl px-6 flex items-center gap-4 shadow-sm">
      {/* Search Section */}
      <div className="flex-1 max-w-xl hidden md:flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search events, tickets, or sessions..."
            className="h-10 pl-10 pr-4 w-full bg-gray-800/60 border border-gray-600/30 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative h-10 w-10 rounded-xl bg-gray-800/60 hover:bg-gray-700/60 transition-colors duration-200 flex items-center justify-center border border-gray-600/30">
          <span className="text-gray-300">🔔</span>
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-600/30">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-100 leading-none">John Doe</p>
            <p className="text-xs text-gray-400 mt-1">Attendee</p>
          </div>
          
          <button className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            <span className="text-white font-semibold text-sm">JD</span>
          </button>
        </div>
      </div>
    </div>
  )
}
