import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Connexion — Lofa',
  description: 'Connectez-vous à votre espace Lofa',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 flex items-center justify-center px-4">
      {/* Fond décoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          lo<span className="text-green-400">fa</span>
        </Link>
      </div>

      {/* Contenu */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}