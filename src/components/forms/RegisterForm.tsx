'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import { IconHome, IconBuildingSkyscraper, IconEye, IconEyeOff, IconLoader } from '@tabler/icons-react'

export default function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Une erreur est survenue')
        return
      }

      router.push('/login?registered=true')
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Erreur globale */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Nom complet
        </label>
        <input
          {...register('name')}
          type="text"
          placeholder="Amadou Diallo"
          className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 transition-all"
        />
        {errors.name && (
          <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="vous@exemple.com"
          className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500/50 transition-all"
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Mot de passe */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Mot de passe
        </label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-green-500/50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Rôle */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Je suis
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="relative cursor-pointer">
  <input
    {...register('role')}
    type="radio"
    value="OWNER"
    className="peer sr-only"
    defaultChecked
  />
  <div className="bg-white/5 border border-white/10 peer-checked:border-green-500/50 peer-checked:bg-green-500/10 rounded-xl px-4 py-3 text-center transition-all">
    <IconHome size={24} className="mx-auto mb-1 text-gray-400 peer-checked:text-green-400" />
    <span className="text-sm text-gray-300 font-medium">
      Propriétaire
    </span>
  </div>
         </label>
         <label className="relative cursor-pointer">
         <input
            {...register('role')}
            type="radio"
            value="MANAGER"
            className="peer sr-only"
         />
  <div className="bg-white/5 border border-white/10 peer-checked:border-green-500/50 peer-checked:bg-green-500/10 rounded-xl px-4 py-3 text-center transition-all">
    <IconBuildingSkyscraper size={24} className="mx-auto mb-1 text-gray-400" />
    <span className="text-sm text-gray-300 font-medium">
      Gestionnaire
    </span>
  </div>
</label>
        </div>
        {errors.role && (
          <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? (
          <>
            <IconLoader size={16} className="animate-spin" />
            Création du compte...
          </>
        ) : (
          'Créer mon compte'
        )}
      </button>
    </form>
  )
}