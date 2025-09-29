'use client'

import Link from 'next/link'
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
                {!loading && !user && (
                  <Link className="btn-main fx-slide w-100" href="/auth/login">
                    <span>Login</span>
                  </Link>
                )}

                {!loading && user && (
                  <>
                    <Link className="btn-main fx-slide w-100" href={targetPath}>
                      <span>{role === 'admin' ? 'Admin' : 'Dashboard'}</span>
                    </Link>
                  </>
                )}

                <div className="menu_side_area">
                  <span id="menu-btn"></span>
                  {!loading && user && (
                    <button
                      type="button"
                      onClick={signOut}
                      className="ms-3 text-light d-none d-md-inline"
                      aria-label="Sign out"
                    >
                      Logout
                    </button>
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
