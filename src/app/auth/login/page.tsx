import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'

export default function LoginPage() {
  return (
    <section className="section-dark p-0" aria-label="section">
      <div className="auth-shell">
        <AuthForm />
        <div className="mt-4 d-flex justify-content-center">
          <Link href="/auth/signup" className="btn-main fx-slide">
            <span>Create Account</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
