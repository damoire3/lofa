'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconLoader, IconCheck, IconTrash } from '@tabler/icons-react'

export default function PaymentStatusActions({
  paymentId,
  currentStatus,
}: {
  paymentId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateStatus = async (status: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'Erreur')
        return
      }
      router.refresh()
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer définitivement ce paiement ?')) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/payments/${paymentId}`, { method: 'DELETE' })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'Erreur')
        return
      }
      router.push('/dashboard/payments')
      router.refresh()
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {currentStatus !== 'PAID' && (
          <button
            onClick={() => updateStatus('PAID')}
            disabled={isLoading}
            className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-green-200 disabled:opacity-50"
          >
            {isLoading ? <IconLoader size={14} className="animate-spin" /> : <IconCheck size={14} />}
            Marquer payé
          </button>
        )}
        {currentStatus !== 'LATE' && (
          <button
            onClick={() => updateStatus('LATE')}
            disabled={isLoading}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-red-200 disabled:opacity-50"
          >
            Marquer en retard
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-gray-200 disabled:opacity-50 ml-auto"
        >
          <IconTrash size={14} />
          Supprimer
        </button>
      </div>
    </div>
  )
}