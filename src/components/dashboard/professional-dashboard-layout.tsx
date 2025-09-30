"use client"

import React, { ReactNode, useState } from "react"
import { cn } from "@/lib/utils"
import { 
  ProfessionalDarkThemeProvider, 
  professionalDarkTheme,
  ProfessionalButton 
} from "./soft-ui/professional-dark-theme"
import { UserRole } from "./types"
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  BarChart3, 
  Users, 
  Settings, 
  FileText, 
  MessageSquare,
  Search,
  Bell,
  Menu,
  X
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/providers/auth-provider"

interface TabItem {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  content: ReactNode
}

interface ProfessionalDashboardLayoutProps {
  role: UserRole
  tabs: TabItem[]
  defaultTab?: string
  title?: string
  description?: string
}

export function ProfessionalDashboardLayout({
  role,
  tabs,
  defaultTab,
  title,
  description
}: ProfessionalDashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut } = useAuth()

  const activeTabContent = tabs.find(tab => tab.id === activeTab)

  return (
    <ProfessionalDarkThemeProvider>
      {/* Add top padding to account for the fixed AiventHeader */}
      <div className="min-h-screen flex relative" style={{ paddingTop: 'var(--aivent-header-height, 96px)' }}>
        {/* Sidebar */}
        <ProfessionalSidebar
          role={role}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-72 relative z-10">
          {/* Topbar */}
          <ProfessionalTopbar
            onMenuClick={() => setSidebarOpen(true)}
            user={user}
            onSignOut={signOut}
          />

          {/* Content */}
          <main className="flex-1 p-6 space-y-8 relative z-10">
            {/* Header */}
            {(title || description) && (
              <header className="space-y-2">
                {title && (
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                    {description}
                  </p>
                )}
              </header>
            )}

            {/* Tab Content */}
            <div className="space-y-8 relative z-10">
              {activeTabContent?.content}
            </div>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </ProfessionalDarkThemeProvider>
  )
}

// Professional Sidebar Component
interface ProfessionalSidebarProps {
  role: UserRole
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  isOpen: boolean
  onClose: () => void
}

function ProfessionalSidebar({
  role,
  tabs,
  activeTab,
  onTabChange,
  isOpen,
  onClose
}: ProfessionalSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar - Add top padding to account for header */}
      <aside
        className="hidden lg:flex lg:flex-col w-72 fixed left-0 h-full bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-2xl z-30"
        style={{ top: 'var(--aivent-header-height, 96px)' }}
      >
        <SidebarContent
          role={role}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </aside>

      {/* Mobile Sidebar - Full height on mobile */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-2xl z-50 transform transition-transform duration-300 lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg"
              style={{ background: professionalDarkTheme.gradients.primary }}
            >
              <span className="font-bold text-sm">W</span>
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">WECON</h1>
              <p className="text-xs text-slate-400 -mt-1">Event Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        <SidebarContent
          role={role}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            onTabChange(tabId)
            onClose()
          }}
        />
      </aside>
    </>
  )
}

// Sidebar Content Component
interface SidebarContentProps {
  role: UserRole
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

function SidebarContent({ role, tabs, activeTab, onTabChange }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo Section - Desktop Only */}
      <div className="hidden lg:flex h-16 px-6 items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ background: professionalDarkTheme.gradients.primary }}
          >
            <span className="font-bold text-sm">W</span>
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">WECON</h1>
            <p className="text-xs text-slate-400 -mt-1">Event Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative w-full text-left",
                  isActive 
                    ? "text-white shadow-lg" 
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                )}
                style={isActive ? { background: professionalDarkTheme.gradients.primary } : {}}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="flex-1">{tab.title}</span>
                {isActive && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Role Badge */}
        <div className="mt-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: professionalDarkTheme.gradients.success }}
              >
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white capitalize">{role}</p>
                <p className="text-xs text-slate-400">Dashboard Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Professional Topbar Component
interface ProfessionalTopbarProps {
  onMenuClick: () => void
  user: any
  onSignOut: () => void
}

function ProfessionalTopbar({ onMenuClick, user, onSignOut }: ProfessionalTopbarProps) {
  const initials = (user?.user_metadata?.full_name || user?.email || "U").slice(0,2).toUpperCase()
  const displayName = user?.user_metadata?.full_name || user?.email || "User"

  return (
    <div className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl px-6 flex items-center gap-4 shadow-lg">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <Menu className="h-5 w-5 text-white" />
      </button>

      {/* Search Section */}
      <div className="flex-1 max-w-xl hidden md:flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, tickets, or sessions..."
            className="h-10 pl-10 pr-4 w-full bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200 flex items-center justify-center border border-white/10">
          <Bell className="h-5 w-5 text-slate-300" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-white leading-none">{displayName}</p>
            <p className="text-xs text-slate-400 mt-1">
              {user?.user_metadata?.role === 'admin' ? 'Administrator' : 
               user?.user_metadata?.role === 'speaker' ? 'Speaker' : 'Attendee'}
            </p>
          </div>
          
          <button className="relative h-10 w-10 rounded-xl hover:bg-white/10 transition-all duration-200">
            <Avatar className="h-9 w-9 border-2 border-white/20 shadow-lg">
              <AvatarImage 
                src={(user?.user_metadata?.avatar_url as string) || ""} 
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback 
                className="text-white font-semibold text-sm"
                style={{ background: professionalDarkTheme.gradients.primary }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </div>
  )
}
