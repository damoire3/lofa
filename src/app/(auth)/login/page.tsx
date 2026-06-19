import LoginForm from '@/components/forms/LoginForm'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const { reason } = await searchParams

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Bon retour parmi nous
        </h1>
        <p className="text-gray-400 text-sm">
          Connectez-vous à votre espace Lofa
        </p>
      </div>

      {reason === 'timeout' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl mb-4">
          Vous avez été déconnecté après 30 minutes d&apos;inactivité.
        </div>
      )}

      {/* Formulaire */}
      <LoginForm />

      {/* Footer */}
      <p className="text-center text-sm text-gray-400 mt-6">
        Pas encore de compte ?{' '}
        <Link
          href="/register"
          className="text-green-400 hover:text-green-300 font-medium transition-colors"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  )
}