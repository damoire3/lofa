'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconLoader, IconBan, IconRefresh } from '@tabler/icons-react'

export default function ContractStatusActions({
  contractId,
  currentStatus,
}: {
  contractId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateStatus = async (status: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/contracts/${contractId}`, {
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

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {currentStatus === 'ACTIVE' && (
          <button
            onClick={() => updateStatus('TERMINATED')}
            disabled={isLoading}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-red-200 disabled:opacity-50"
          >
            {isLoading ? <IconLoader size={14} className="animate-spin" /> : <IconBan size={14} />}
            Résilier le contrat
          </button>
        )}
        {currentStatus !== 'ACTIVE' && (
          <button
            onClick={() => updateStatus('ACTIVE')}
            disabled={isLoading}
            className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-green-200 disabled:opacity-50"
          >
            {isLoading ? <IconLoader size={14} className="animate-spin" /> : <IconRefresh size={14} />}
            Réactiver
          </button>
        )}
      </div>
    </div>
  )
}