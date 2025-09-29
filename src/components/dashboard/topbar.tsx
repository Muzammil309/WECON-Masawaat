"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

export function Topbar() {
  const { user, signOut } = useAuth()
  const initials = (user?.user_metadata?.full_name || user?.email || "U").slice(0,2).toUpperCase()

  return (
    <div className="h-14 border-b border-border/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 px-4 flex items-center gap-2">
      <div className="flex-1 max-w-xl hidden md:flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input aria-label="Search" placeholder="Search..." className="h-9 bg-muted/40 border-none focus-visible:ring-0" />
      </div>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-5 w-5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={(user?.user_metadata?.avatar_url as string) || ""} alt={user?.email || "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="max-w-[220px] truncate">{user?.user_metadata?.full_name || user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/profile">Profile</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/settings">Settings</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut?.()}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

