'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconLoader, IconLink, IconPlus } from '@tabler/icons-react'
import { formatCurrency } from '@/lib/utils'

type Property = {
  id: string
  name: string
  city: string
  rentAmount: number
}

export default function AttachPropertyForm({
  ownerId,
  properties,
}: {
  ownerId: string
  properties: Property[]
}) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAttach = async () => {
    if (!selectedId) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/properties/${selectedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId }),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'Erreur lors du rattachement')
        return
      }

      setSelectedId('')
      router.refresh()
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {properties.length > 0 ? (
        <>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full border border-gray-200 text-gray-900 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-all bg-white"
          >
            <option value="">Sélectionner un bien existant</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.city} ({formatCurrency(p.rentAmount)}/mois)
              </option>
            ))}
          </select>

          <button
            onClick={handleAttach}
            disabled={!selectedId || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            {isLoading ? (
              <IconLoader size={14} className="animate-spin" />
            ) : (
              <IconLink size={14} />
            )}
            Rattacher ce bien
          </button>

          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
        </>
      ) : (
        <p className="text-xs text-gray-400 text-center py-1">
          Aucun bien sans propriétaire disponible
        </p>
      )}

      <Link
        href={`/dashboard/properties/new?ownerId=${ownerId}`}
        className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium py-2.5 rounded-xl transition-colors border border-gray-200"
      >
        <IconPlus size={14} />
        Créer un nouveau bien
      </Link>
    </div>
  )
}