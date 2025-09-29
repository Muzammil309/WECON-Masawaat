"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NavItem, UserRole } from "./types"
import { Menu, Calendar, Ticket, BarChart3, Users, MessageSquare, Settings, LayoutDashboard, FileText } from "lucide-react"

function getNavItemsByRole(role: UserRole): NavItem[] {
  if (role === "admin") {
    return [
      { title: "Overview", href: "/admin", icon: LayoutDashboard },
      { title: "Events", href: "/events", icon: Calendar },
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Tickets", href: "/admin/tickets", icon: Ticket },
      { title: "Analytics", href: "/admin#analytics", icon: BarChart3 },
      { title: "Messages", href: "/admin/messages", icon: MessageSquare },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ]
  }
  if (role === "speaker") {
    return [
      { title: "My Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Sessions", href: "/dashboard#sessions", icon: Calendar },
      { title: "Materials", href: "/dashboard#materials", icon: FileText },
      { title: "Engagement", href: "/dashboard#engagement", icon: BarChart3 },
      { title: "Feedback", href: "/dashboard#feedback", icon: MessageSquare },
      { title: "Settings", href: "/settings", icon: Settings },
    ]
  }
  return [
    { title: "My Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "My Tickets", href: "/tickets", icon: Ticket },
    { title: "Schedule", href: "/schedule", icon: Calendar },
    { title: "Recommendations", href: "/recommendations", icon: BarChart3 },
    { title: "Networking", href: "/networking", icon: Users },
    { title: "Settings", href: "/settings", icon: Settings },
  ]
}

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname()
  const items = getNavItemsByRole(role)

  return (
    <aside className="hidden lg:flex lg:flex-col w-72 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/30 shadow-2xl">
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
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} aria-label={item.title}>
                <div
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
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1">{item.title}</span>
                  {active && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Role Badge */}
        <div className="mt-8 px-4">
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-xl p-4 border border-gray-600/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-100 capitalize">{role}</p>
                <p className="text-xs text-gray-400">Dashboard Access</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}

export function MobileSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname()
  const items = getNavItemsByRole(role)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation" className="h-10 w-10 rounded-xl hover:bg-slate-100/80">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-80 bg-white/95 backdrop-blur-xl">
        {/* Mobile Logo Section */}
        <div className="h-16 px-6 flex items-center border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg">WECON</h1>
              <p className="text-xs text-slate-500 -mt-1">Event Management</p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <ScrollArea className="h-[calc(100vh-64px)] px-4 py-6">
          <nav className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href} aria-label={item.title}>
                  <div
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative",
                      active
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1">{item.title}</span>
                    {active && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Mobile Role Badge */}
          <div className="mt-8 px-4">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 capitalize">{role}</p>
                  <p className="text-xs text-slate-500">Dashboard Access</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

