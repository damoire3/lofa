import RegisterForm from '@/components/forms/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Créer un compte
        </h1>
        <p className="text-gray-400 text-sm">
          Commencez à gérer vos biens gratuitement
        </p>
      </div>

      {/* Formulaire */}
      <RegisterForm />

      {/* Footer */}
      <p className="text-center text-sm text-gray-400 mt-6">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
          Se connecter
        </Link>
      </p>
    </div>
  )
}