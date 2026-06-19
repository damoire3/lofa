'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { tenantSchema, type TenantInput } from '@/lib/validations'
import { IconLoader, IconAlertTriangle } from '@tabler/icons-react'

const ID_TYPE_LABELS = {
  CNI: 'Carte Nationale d\'Identité',
  PASSPORT: 'Passeport',
  RESIDENCE_PERMIT: 'Carte de Séjour',
  VOTER_CARD: 'Carte d\'Électeur',
}

type DuplicateInfo = {
  id: string
  firstName: string
  lastName: string
  currentProperties: string[]
}

export default function TenantForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [duplicate, setDuplicate] = useState<DuplicateInfo | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantInput>({
    resolver: zodResolver(tenantSchema),
  })

  const onSubmit = async (data: TenantInput) => {
    setIsLoading(true)
    setError(null)
    setDuplicate(null)

    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (res.status === 409 && json.error === 'DUPLICATE') {
        setDuplicate(json.existingTenant)
        return
      }

      if (!res.ok) {
        setError(json.error || 'Une erreur est survenue')
        return
      }

      router.push(`/dashboard/tenants/${json.id}`)
      router.refresh()
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {duplicate && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">
          <div className="flex items-start gap-2">
            <IconAlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">
                {duplicate.firstName} {duplicate.lastName} existe déjà
              </p>
              <p className="text-xs mt-1">
                Cette personne loue déjà : {duplicate.currentProperties.join(', ') || 'aucun bien actuellement'}.
              </p>
              <p className="text-xs mt-2">
                Pour ajouter une nouvelle location à cette personne, allez sur sa fiche et créez un nouveau contrat directement.
              </p>
              <a
                href={`/dashboard/tenants/${duplicate.id}`}
                className="inline-block mt-2 text-xs font-semibold underline"
              >
                Voir la fiche de {duplicate.firstName}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Section identité */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
          Informations personnelles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Prénom
            </label>
            <input
              {...register('firstName')}
              type="text"
              placeholder="Amadou"
              className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nom
            </label>
            <input
              {...register('lastName')}
              type="text"
              placeholder="Diallo"
              className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Date de naissance
            </label>
            <input
              {...register('dateOfBirth')}
              type="date"
              className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lieu de naissance
            </label>
            <input
              {...register('placeOfBirth')}
              type="text"
              placeholder="Cotonou"
              className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nationalité
            </label>
            <input
              {...register('nationality')}
              type="text"
              placeholder="Béninoise"
              className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Téléphone
            </label>
            <input
              {...register('phone')}
              type="tel"
              placeholder="+229 97 00 00 00"
              className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="locataire@exemple.com"
              className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section pièce d'identité */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
          Pièce d&apos;identité
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Type de pièce
            </label>
            <select
              {...register('idType')}
              className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all bg-white"
            >
              <option value="">Sélectionner un type</option>
              {Object.entries(ID_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Numéro de pièce
            </label>
            <input
              {...register('idNumber')}
              type="text"
              placeholder="BJ-123456"
              className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">
              Utilisé pour détecter si cette personne a déjà un profil.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-4 py-3 rounded-xl">
        Après la création, vous pourrez ajouter un ou plusieurs contrats (biens loués) pour ce locataire depuis sa fiche.
      </div>

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
          'Ajouter le locataire'
        )}
      </button>
    </form>
  )
}