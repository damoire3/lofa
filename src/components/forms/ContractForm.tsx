'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { contractSchema, type ContractInput } from '@/lib/validations'
import { formatCurrency } from '@/lib/utils'
import { IconLoader, IconAlertTriangle } from '@tabler/icons-react'

type Tenant = { id: string; firstName: string; lastName: string }
type Property = { id: string; name: string; rentAmount: number }

export default function ContractForm({
  tenants,
  properties,
  defaultTenantId,
}: {
  tenants: Tenant[]
  properties: Property[]
  defaultTenantId?: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContractInput>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      tenantId: defaultTenantId || '',
    },
  })

  const selectedPropertyId = watch('propertyId')

  const onPropertyChange = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId)
    if (property) {
      setValue('rentAmount', property.rentAmount)
    }
  }

  const onSubmit = async (data: ContractInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Une erreur est survenue')
        return
      }

      router.push(`/dashboard/tenants/${data.tenantId}`)
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

      {/* Locataire */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Locataire
        </label>
        <select
          {...register('tenantId')}
          className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all bg-white"
          disabled={!!defaultTenantId}
        >
          <option value="">Sélectionner un locataire</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.firstName} {t.lastName}
            </option>
          ))}
        </select>
        {errors.tenantId && (
          <p className="text-red-500 text-xs mt-1">{errors.tenantId.message}</p>
        )}
        {defaultTenantId && (
          <p className="text-xs text-gray-400 mt-1">
            Locataire pré-sélectionné depuis sa fiche
          </p>
        )}
      </div>

      {/* Bien */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Bien
        </label>
        <select
          {...register('propertyId')}
          onChange={(e) => onPropertyChange(e.target.value)}
          className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all bg-white"
        >
          <option value="">Sélectionner un bien</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {formatCurrency(p.rentAmount)}/mois
            </option>
          ))}
        </select>
        {errors.propertyId && (
          <p className="text-red-500 text-xs mt-1">{errors.propertyId.message}</p>
        )}
      </div>

      {selectedPropertyId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
          <IconAlertTriangle size={14} />
          Si ce bien a déjà un contrat actif, il sera automatiquement clôturé.
        </div>
      )}

      {/* Date de début */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Date de début
        </label>
        <input
          {...register('startDate')}
          type="date"
          className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
        />
        {errors.startDate && (
          <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
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
          className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
        />
        {errors.rentAmount && (
          <p className="text-red-500 text-xs mt-1">{errors.rentAmount.message}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Pré-rempli avec le loyer du bien, modifiable si nécessaire
        </p>
      </div>

      {/* Caution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Caution (XOF) <span className="text-gray-400 font-normal">(optionnel)</span>
        </label>
        <input
          {...register('deposit', { valueAsNumber: true })}
          type="number"
          placeholder="150000"
          className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
        />
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
          'Créer le contrat'
        )}
      </button>
    </form>
  )
}