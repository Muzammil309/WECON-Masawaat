'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'

export function AiventHeader() {
  const { user, role, loading, signOut } = useAuth()
  const targetPath = role === 'admin' ? '/admin' : '/dashboard'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering auth-dependent content until mounted
  if (!mounted) {
    return (
      <header className="transparent">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="de-flex">
                <div className="de-flex-col">
                  <div id="logo">
                    <Link href="/">
                      <img className="logo-main" src="/aivent/images/logo.webp" alt="" />
                      <img className="logo-scroll" src="/aivent/images/logo.webp" alt="" />
                      <img className="logo-mobile" src="/aivent/images/logo.webp" alt="" />
                    </Link>
                  </div>
                </div>
                <div className="de-flex-col">
                  <div className="de-flex-col header-col-mid">
                    <ul id="mainmenu">
                      <li><a className="menu-item active" href="#section-hero">Home</a></li>
                      <li><a className="menu-item" href="#section-about">About</a></li>
                      <li><a className="menu-item" href="#section-why-attend">Why Attend</a></li>
                      <li><a className="menu-item" href="#section-speakers">Speakers</a></li>
                      <li><a className="menu-item" href="#section-schedule">Schedule</a></li>
                      <li><a className="menu-item" href="#section-tickets">Tickets</a></li>
                      <li><a className="menu-item" href="#section-venue">Venue</a></li>
                      <li><a className="menu-item" href="#section-faq">FAQ</a></li>
                    </ul>
                  </div>
                </div>
                <div className="de-flex-col">
                  {/* Placeholder during SSR */}
                  <div className="d-flex align-items-center gap-3" style={{ position: 'relative', zIndex: 100, minHeight: '40px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="transparent">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="de-flex">
              <div className="de-flex-col">
                {/* logo begin */}
                <div id="logo">
                  <Link href="/">
                    <img className="logo-main" src="/aivent/images/logo.webp" alt="" />
                    <img className="logo-scroll" src="/aivent/images/logo.webp" alt="" />
                    <img className="logo-mobile" src="/aivent/images/logo.webp" alt="" />
                  </Link>
                </div>
                {/* logo close */}
              </div>

              <div className="de-flex-col">
                <div className="de-flex-col header-col-mid">
                  <ul id="mainmenu">
                    <li><a className="menu-item active" href="#section-hero">Home</a></li>
                    <li><a className="menu-item" href="#section-about">About</a></li>
                    <li><a className="menu-item" href="#section-why-attend">Why Attend</a></li>
                    <li><a className="menu-item" href="#section-speakers">Speakers</a></li>
                    <li><a className="menu-item" href="#section-schedule">Schedule</a></li>
                    <li><a className="menu-item" href="#section-tickets">Tickets</a></li>
                    <li><a className="menu-item" href="#section-venue">Venue</a></li>
                    <li><a className="menu-item" href="#section-faq">FAQ</a></li>
                    {user && role === 'admin' && (
                      <li>
                        <Link className="menu-item" href="/admin">Admin</Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="de-flex-col">
                <div className="d-flex align-items-center gap-3" style={{ position: 'relative', zIndex: 100 }}>
                  {/* Always render navigation elements, just hide during loading */}
                  {!user ? (
                    <Link
                      className="btn-main fx-slide"
                      href="/auth/login"
                      style={{
                        opacity: loading ? 0 : 1,
                        visibility: loading ? 'hidden' : 'visible',
                        display: 'inline-flex',
                        position: 'relative',
                        zIndex: 100,
                        transition: 'opacity 0.3s ease, visibility 0.3s ease'
                      }}
                    >
                      <span>Login</span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        className="btn-main fx-slide d-inline-flex align-items-center"
                        href={targetPath}
                        style={{
                          opacity: loading ? 0 : 1,
                          visibility: loading ? 'hidden' : 'visible',
                          display: 'inline-flex',
                          minWidth: '120px',
                          justifyContent: 'center',
                          position: 'relative',
                          zIndex: 100,
                          transition: 'opacity 0.3s ease, visibility 0.3s ease'
                        }}
                      >
                        <span>{role === 'admin' ? 'Admin' : 'Dashboard'}</span>
                      </Link>

                      <div className="menu_side_area position-relative" style={{ zIndex: 100 }}>
                        <span id="menu-btn"></span>

                        {/* Avatar / Profile Dropdown */}
                        <div style={{
                          opacity: loading ? 0 : 1,
                          visibility: loading ? 'hidden' : 'visible',
                          display: 'block',
                          position: 'relative',
                          zIndex: 100,
                          transition: 'opacity 0.3s ease, visibility 0.3s ease'
                        }}>
                          <ProfileDropdown
                            email={user.email || ''}
                            name={(user.user_metadata as any)?.full_name || (user.user_metadata as any)?.name || user.email || ''}
                            avatarUrl={(user.user_metadata as any)?.avatar_url || ''}
                            role={role}
                            onLogout={signOut}
                            targetPath={targetPath}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>



          </div>
        </div>
      </div>
    </header>
  )
}


function ProfileDropdown({ email, name, avatarUrl, role, onLogout, targetPath }: {
  email: string
  name: string
  avatarUrl?: string
  role: 'admin' | 'speaker' | 'attendee' | null
  onLogout: () => Promise<void>
  targetPath: string
}) {
  const [open, setOpen] = useState(false)

  const initials = useMemo(() => {
    const src = name || email || ''
    const parts = src.replace(/@.*/, '').split(/\s+|\.|_|-/).filter(Boolean)
    const chars = (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
    return chars.toUpperCase() || 'U'
  }, [name, email])

  return (
    <div
      className="d-inline-block ms-3 position-relative"
      onBlur={() => setOpen(false)}
      style={{ opacity: 1, visibility: 'visible', display: 'inline-block', zIndex: 100 }}
    >
      <button
        type="button"
        className="rounded-circle overflow-hidden border-0 p-0 bg-transparent"
        style={{
          width: 40,
          height: 40,
          opacity: 1,
          visibility: 'visible',
          display: 'block',
          transition: 'all 0.3s ease',
          transform: 'scale(1)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          position: 'relative',
          zIndex: 100
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-circle"
            style={{ opacity: 1, visibility: 'visible' }}
          />
        ) : (
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              opacity: 1,
              visibility: 'visible',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
          >
            <span className="fw-bold">{initials}</span>
          </div>
        )}
      </button>

      {open && (
        <div
          className="position-absolute end-0 mt-2"
          style={{ minWidth: 220, zIndex: 9999 }}
          role="menu"
        >
          <div className="bg-dark text-light rounded-3 shadow p-2 border border-white-10">
            <div className="px-3 py-2 border-bottom border-white-10">
              <div className="fw-semibold small">{name}</div>
              <div className="text-muted small">{email}</div>
            </div>
            <div className="py-1">
              <Link href="/dashboard" className="dropdown-item d-block px-3 py-2 text-light">
                Profile Settings
              </Link>
              <Link href={targetPath} className="dropdown-item d-block px-3 py-2 text-light">
                {role === 'admin' ? 'Admin' : 'Dashboard'}
              </Link>
            </div>
            <div className="border-top border-white-10" />
            <button
              type="button"
              onClick={onLogout}
              className="d-block w-100 text-start px-3 py-2 text-danger bg-transparent border-0"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
