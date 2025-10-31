'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Users, Ticket, BarChart3, Settings, User, HelpCircle, LogOut } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

interface MenuItem {
  label: string
  href: string
  icon: React.ReactNode
  roles?: ('admin' | 'attendee' | 'speaker')[] // If undefined, show to all roles
}

const adminMenuItems: MenuItem[] = [
  {
    label: 'Overview',
    href: '/dashboard/vision',
    icon: <Home className="h-[15px] w-[15px]" />,
  },
  {
    label: 'Events',
    href: '/dashboard/vision/events',
    icon: <Calendar className="h-[15px] w-[15px]" />,
  },
  {
    label: 'Attendees',
    href: '/dashboard/vision/attendees',
    icon: <Users className="h-[15px] w-[15px]" />,
  },
  {
    label: 'Analytics',
    href: '/dashboard/vision/analytics',
    icon: <BarChart3 className="h-[15px] w-[15px]" />,
  },
  {
    label: 'Settings',
    href: '/dashboard/vision/settings',
    icon: <Settings className="h-[15px] w-[15px]" />,
  },
]

const attendeeMenuItems: MenuItem[] = [
  {
    label: 'Overview',
    href: '/dashboard/vision',
    icon: <Home className="h-[15px] w-[15px]" />,
  },
  {
    label: 'My Events',
    href: '/dashboard/vision/my-events',
    icon: <Calendar className="h-[15px] w-[15px]" />,
  },
  {
    label: 'My Tickets',
    href: '/dashboard/vision/my-tickets',
    icon: <Ticket className="h-[15px] w-[15px]" />,
  },
  {
    label: 'Profile',
    href: '/dashboard/vision/profile',
    icon: <User className="h-[15px] w-[15px]" />,
  },
]

export function VisionSidebar() {
  const pathname = usePathname()
  const { role, signOut } = useAuth()

  // Select menu items based on role
  const menuItems = role === 'admin' ? adminMenuItems : attendeeMenuItems

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/auth/login'
  }

  return (
    <div className="fixed left-[10px] top-[10px] h-[calc(100vh-20px)] w-[264px] vision-glass-card flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center pt-[36px] pb-[25px]">
        <p
          className="text-[14px] font-medium tracking-[2.52px] text-center"
          style={{
            fontFamily: '"Plus Jakarta Display", sans-serif',
            background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          WECON MASAWAAT
        </p>
      </div>

      {/* Separator Line */}
      <div className="mx-[15px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Menu Items */}
      <nav className="mt-[23px] px-[16px] space-y-[12px] flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-[15.5px] px-[16px] py-[12px] rounded-[15px] transition-all
                ${
                  isActive
                    ? 'vision-sidebar-active'
                    : 'hover:bg-white/5'
                }
              `}
            >
              <div
                className={`
                  flex items-center justify-center w-[30px] h-[30px] rounded-[12px]
                  ${
                    isActive
                      ? 'bg-gradient-to-br from-[#7928CA] to-[#4318FF]'
                      : 'vision-sidebar-item'
                  }
                `}
              >
                <div className="text-white">
                  {item.icon}
                </div>
              </div>
              <span
                className="text-[14px] font-medium text-white"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-[15.5px] px-[16px] py-[12px] rounded-[15px] transition-all hover:bg-white/5 w-full text-left"
        >
          <div className="flex items-center justify-center w-[30px] h-[30px] rounded-[12px] vision-sidebar-item">
            <LogOut className="h-[15px] w-[15px] text-white" />
          </div>
          <span
            className="text-[14px] font-medium text-white"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            Sign Out
          </span>
        </button>
      </nav>

      {/* Need Help Card */}
      <div className="absolute bottom-[20px] left-[23px] right-[23px]">
        <div
          className="relative overflow-hidden rounded-[15px] p-[16px]"
          style={{
            background: 'linear-gradient(135deg, #0075FF 0%, #4318FF 100%)',
          }}
        >
          {/* Background Image Overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="mb-[12px]">
              <div className="flex items-center justify-center w-[35px] h-[35px] bg-white rounded-[12px]">
                <HelpCircle className="h-[24px] w-[24px] text-[#0075FF]" />
              </div>
            </div>

            {/* Text */}
            <div className="mb-[12px]">
              <h3
                className="text-[14px] font-bold text-white mb-[4px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.4' }}
              >
                Need help?
              </h3>
              <p
                className="text-[12px] font-normal text-white/90"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif', lineHeight: '1.5' }}
              >
                Please check our docs
              </p>
            </div>

            {/* Button */}
            <button
              className="w-full px-[8px] py-[4px] rounded-[12px] text-[10px] font-bold text-white backdrop-blur-[5px] hover:bg-white/10 transition-all"
              style={{
                fontFamily: '"Plus Jakarta Display", sans-serif',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              DOCUMENTATION
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

