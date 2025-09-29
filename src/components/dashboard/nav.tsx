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
    <aside className="hidden lg:flex lg:flex-col w-64 border-r border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="h-14 px-4 flex items-center font-semibold">WECON</div>
      <Separator />
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="grid gap-1">
          {items.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} aria-label={item.title}>
                <span
                  className={cn(
                    "group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </span>
              </Link>
            )
          })}
        </nav>
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
        <Button variant="ghost" size="icon" aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <div className="h-14 px-4 flex items-center font-semibold">WECON</div>
        <Separator />
        <ScrollArea className="h-[calc(100vh-56px)] px-2 py-4">
          <nav className="grid gap-1">
            {items.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <Link key={item.href} href={item.href} aria-label={item.title}>
                  <span
                    className={cn(
                      "group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </span>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

