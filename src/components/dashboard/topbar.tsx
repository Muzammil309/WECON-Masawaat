"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Settings, User, LogOut } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

export function Topbar() {
  const { user, signOut } = useAuth()
  const initials = (user?.user_metadata?.full_name || user?.email || "U").slice(0,2).toUpperCase()
  const displayName = user?.user_metadata?.full_name || user?.email || "User"

  return (
    <div className="h-16 border-b border-gray-700/30 bg-gray-900/60 backdrop-blur-xl px-6 flex items-center gap-4 shadow-sm">
      {/* Search Section */}
      <div className="flex-1 max-w-xl hidden md:flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            aria-label="Search"
            placeholder="Search events, tickets, or sessions..."
            className="h-10 pl-10 bg-gray-800/60 border-gray-600/30 rounded-xl text-gray-100 placeholder-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative h-10 w-10 rounded-xl hover:bg-gray-800/60 transition-colors duration-200 border border-gray-600/30"
        >
          <Bell className="h-5 w-5 text-gray-300" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
            3
          </Badge>
        </Button>

        {/* User Profile - Always Visible */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-600/30">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-100 leading-none">{displayName}</p>
            <p className="text-xs text-gray-400 mt-1">
              {user?.user_metadata?.role === 'admin' ? 'Administrator' :
               user?.user_metadata?.role === 'speaker' ? 'Speaker' : 'Attendee'}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-xl p-0 hover:bg-gray-800/60 transition-all duration-200">
                <Avatar className="h-9 w-9 border-2 border-gray-600 shadow-md">
                  <AvatarImage
                    src={(user?.user_metadata?.avatar_url as string) || ""}
                    alt={displayName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-xl rounded-xl">
              <DropdownMenuLabel className="px-3 py-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-slate-900">{displayName}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-200/60" />
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <a href="/profile" className="flex items-center gap-2 px-3 py-2">
                  <User className="h-4 w-4" />
                  Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <a href="/settings" className="flex items-center gap-2 px-3 py-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200/60" />
              <DropdownMenuItem
                onClick={() => signOut?.()}
                className="rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <div className="flex items-center gap-2 px-3 py-2">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

