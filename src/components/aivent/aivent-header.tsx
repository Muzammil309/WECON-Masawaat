'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import { useAuth } from '@/components/providers/auth-provider'

export function AiventHeader() {
  const { user, role, loading, signOut } = useAuth()
  const targetPath = role === 'admin' ? '/admin' : '/dashboard'

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
                <div className="d-flex align-items-center gap-3">
                  {!loading && !user && (
                    <Link className="btn-main fx-slide" href="/auth/login">
                      <span>Login</span>
                    </Link>
                  )}

                  {!loading && user && (
                    <Link
                      className="btn-main fx-slide d-inline-flex align-items-center"
                      href={targetPath}
                      style={{
                        opacity: 1,
                        visibility: 'visible',
                        display: 'inline-flex !important',
                        minWidth: '120px',
                        justifyContent: 'center'
                      }}
                    >
                      <span>{role === 'admin' ? 'Admin' : 'Dashboard'}</span>
                    </Link>
                  )}

                  <div className="menu_side_area position-relative">
                    <span id="menu-btn"></span>

                    {/* Avatar / Profile Dropdown - Always Visible */}
                    {!loading && user && (
                      <div style={{ opacity: 1, visibility: 'visible', display: 'block' }}>
                        <ProfileDropdown
                          email={user.email || ''}
                          name={(user.user_metadata as any)?.full_name || (user.user_metadata as any)?.name || user.email || ''}
                          avatarUrl={(user.user_metadata as any)?.avatar_url || ''}
                          role={role}
                          onLogout={signOut}
                          targetPath={targetPath}
                        />
                      </div>
                    )}
                  </div>
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
      style={{ opacity: 1, visibility: 'visible', display: 'inline-block' }}
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
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
          style={{ minWidth: 220, zIndex: 1000 }}
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
