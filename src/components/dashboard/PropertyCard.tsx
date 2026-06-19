import Link from 'next/link'
import {
  IconBuildingSkyscraper,
  IconUser,
  IconFileText,
  IconChevronRight,
} from '@tabler/icons-react'
import { formatCurrency } from '@/lib/utils'
import { PROPERTY_TYPE_LABELS } from '@/constants'
import type { PropertyWithRelations, Contract, Tenant } from '@/types'

export default function PropertyCard({ property }: { property: PropertyWithRelations }) {
  const activeContract = property.contracts.find(
    (c: Contract) => c.status === 'ACTIVE'
  ) as (Contract & { tenant: Tenant }) | undefined

  return (
    <Link
      href={`/dashboard/properties/${property.id}`}
      className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-200 hover:shadow-md transition-all duration-200 group block"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
          <IconBuildingSkyscraper size={20} className="text-green-600" />
        </div>
        <IconChevronRight
          size={18}
          className="text-gray-300 group-hover:text-green-500 transition-colors"
        />
      </div>

      {/* Nom & type */}
      <h3 className="font-semibold text-gray-900 mb-1 truncate">{property.name}</h3>
      <p className="text-xs text-gray-400 mb-1">
        {PROPERTY_TYPE_LABELS[property.type]}
      </p>
      <p className="text-xs text-gray-400 mb-4 truncate">
        {property.address}, {property.city}
      </p>

      {/* Loyer */}
      <div className="bg-gray-50 rounded-xl px-3 py-2 mb-4">
        <p className="text-xs text-gray-500">Loyer mensuel</p>
        <p className="text-lg font-bold text-gray-900">
          {formatCurrency(property.rentAmount)}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <IconUser size={14} />
          {activeContract ? (
            <span className="truncate max-w-[100px]">
              {activeContract.tenant.firstName} {activeContract.tenant.lastName}
            </span>
          ) : (
            <span className="text-gray-400">Vacant</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <IconFileText size={14} />
          {activeContract ? (
            <span className="text-green-600 font-medium">Contrat actif</span>
          ) : (
            <span className="text-gray-400">Pas de contrat</span>
          )}
        </div>
      </div>
    </Link>
  )
}