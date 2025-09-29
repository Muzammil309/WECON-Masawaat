import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'

export default function LoginPage() {
  return (
    <div>
      <AuthForm />
      <div className="mt-6 flex items-center justify-center">
        <Link href="/auth/signup" className="btn-main fx-slide">
          <span>Create Account</span>
        </Link>
      </div>
    </div>
  )
}
