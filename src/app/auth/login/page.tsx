import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'

export default function LoginPage() {
  return (
    <section className="section-dark p-0" aria-label="section">
      <AuthForm />
      <div className="mt-6 flex items-center justify-center pb-12">
        <Link href="/auth/signup" className="btn-main fx-slide">
          <span>Create Account</span>
        </Link>
      </div>
    </section>
  )
}
