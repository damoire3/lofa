'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { propertySchema, type PropertyInput } from '@/lib/validations'
import { PROPERTY_TYPE_LABELS } from '@/constants'
import { IconLoader } from '@tabler/icons-react'

type Owner = { id: string; firstName: string; lastName: string }

export default function PropertyForm({
  owners = [],
  userRole,
  defaultOwnerId,
}: {
  owners?: Owner[]
  userRole: string
  defaultOwnerId?: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>(defaultOwnerId || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
  })

  const onSubmit = async (data: PropertyInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ownerId: selectedOwnerId || null,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Une erreur est survenue')
        return
      }

      router.push('/dashboard/properties')
      router.refresh()
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Nom du bien
        </label>
        <input
          {...register('name')}
          type="text"
          placeholder="Appartement Centre-ville"
          className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Type de bien
        </label>
        <select
          {...register('type')}
          className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all bg-white"
        >
          <option value="">Sélectionner un type</option>
          {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {errors.type && (
          <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
        )}
      </div>

      {/* Adresse */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Adresse
        </label>
        <input
          {...register('address')}
          type="text"
          placeholder="123 Rue des Cocotiers"
          className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* Ville */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Ville
        </label>
        <input
          {...register('city')}
          type="text"
          placeholder="Cotonou"
          className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
        />
        {errors.city && (
          <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
        )}
      </div>

      {/* Loyer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Loyer mensuel (XOF)
        </label>
        <input
          {...register('rentAmount', { valueAsNumber: true })}
          type="number"
          placeholder="150000"
          className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
        />
        {errors.rentAmount && (
          <p className="text-red-500 text-xs mt-1">{errors.rentAmount.message}</p>
        )}
      </div>

      {/* Propriétaire (gestionnaire uniquement) */}
      {userRole === 'MANAGER' && owners.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Propriétaire <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <select
            value={selectedOwnerId}
            onChange={(e) => setSelectedOwnerId(e.target.value)}
            className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all bg-white"
          >
            <option value="">Aucun propriétaire</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.firstName} {o.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <IconLoader size={16} className="animate-spin" />
            Enregistrement...
          </>
        ) : (
          'Ajouter le bien'
        )}
      </button>
    </form>
  )
}