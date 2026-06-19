'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { paymentSchema, type PaymentInput } from '@/lib/validations'
import { formatCurrency, calculateCommission } from '@/lib/utils'
import { IconLoader, IconInfoCircle } from '@tabler/icons-react'
import type { Contract, Property } from '@/types'

type TenantWithContracts = {
  id: string
  firstName: string
  lastName: string
  contracts: (Contract & { property: Property })[]
}

export default function PaymentForm({
  tenants,
  userPlan,
}: {
  tenants: TenantWithContracts[]
  userPlan: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTenantId, setSelectedTenantId] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: 'CASH',
    },
  })

  const amount = watch('amount')
  const expectedAmount = watch('expectedAmount')
  const isPartial = amount && expectedAmount && amount < expectedAmount
  const commission = userPlan === 'FREE' && amount
    ? calculateCommission(amount)
    : 0

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId)
  const tenantContracts = selectedTenant?.contracts || []

  const onContractChange = (contractId: string) => {
    const contract = tenantContracts.find((c) => c.id === contractId)
    if (contract) {
      setValue('expectedAmount', contract.rentAmount)
    }
  }

  const onSubmit = async (data: PaymentInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Une erreur est survenue')
        return
      }

      router.push('/dashboard/payments')
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
          onChange={(e) => {
            setSelectedTenantId(e.target.value)
            setValue('contractId', '')
          }}
          className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all bg-white"
        >
          <option value="">Sélectionner un locataire</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.firstName} {t.lastName}
              {t.contracts.length > 1 ? ` (${t.contracts.length} biens)` : ''}
            </option>
          ))}
        </select>
        {errors.tenantId && (
          <p className="text-red-500 text-xs mt-1">{errors.tenantId.message}</p>
        )}
      </div>

      {/* Bien concerné — uniquement si le locataire a des contrats */}
      {selectedTenant && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Bien concerné
          </label>
          {tenantContracts.length === 0 ? (
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              Ce locataire n&apos;a aucun contrat actif. Créez d&apos;abord un contrat.
            </p>
          ) : (
            <select
              {...register('contractId')}
              onChange={(e) => onContractChange(e.target.value)}
              className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all bg-white"
            >
              <option value="">Sélectionner un bien</option>
              {tenantContracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.property.name} — {formatCurrency(c.rentAmount)}/mois
                </option>
              ))}
            </select>
          )}
          {errors.contractId && (
            <p className="text-red-500 text-xs mt-1">{errors.contractId.message}</p>
          )}
        </div>
      )}

      {/* Montant attendu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Montant attendu (XOF)
        </label>
        <input
          {...register('expectedAmount', { valueAsNumber: true })}
          type="number"
          placeholder="150000"
          className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
        />
        {errors.expectedAmount && (
          <p className="text-red-500 text-xs mt-1">{errors.expectedAmount.message}</p>
        )}
      </div>

      {/* Montant payé */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Montant reçu (XOF)
        </label>
        <input
          {...register('amount', { valueAsNumber: true })}
          type="number"
          placeholder="150000"
          className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
        )}

        {isPartial && (
          <div className="mt-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
            <IconInfoCircle size={14} />
            Paiement partiel — solde restant : {formatCurrency(expectedAmount - amount)}
          </div>
        )}

        {commission > 0 && (
          <div className="mt-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
            <IconInfoCircle size={14} />
            Commission Lofa (5%) : {formatCurrency(commission)}
          </div>
        )}
      </div>

      {/* Méthode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Méthode de paiement
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'CASH', label: 'Espèces', emoji: '💵' },
            { value: 'MOBILE_MONEY', label: 'Mobile Money', emoji: '📱' },
            { value: 'BANK_TRANSFER', label: 'Virement', emoji: '🏦' },
          ].map((method) => (
            <label key={method.value} className="cursor-pointer">
              <input
                {...register('method')}
                type="radio"
                value={method.value}
                className="peer sr-only"
              />
              <div className="bg-gray-50 border border-gray-200 peer-checked:border-green-500 peer-checked:bg-green-50 rounded-xl px-3 py-3 text-center transition-all">
                <span className="text-lg block mb-1">{method.emoji}</span>
                <span className="text-xs font-medium text-gray-600 peer-checked:text-green-700">
                  {method.label}
                </span>
              </div>
            </label>
          ))}
        </div>
        {errors.method && (
          <p className="text-red-500 text-xs mt-1">{errors.method.message}</p>
        )}
      </div>

      {/* Date d'échéance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Date d&apos;échéance
        </label>
        <input
          {...register('dueDate')}
          type="date"
          className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
        />
        {errors.dueDate && (
          <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>
        )}
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
          'Enregistrer le paiement'
        )}
      </button>
    </form>
  )
}