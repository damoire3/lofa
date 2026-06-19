import Link from 'next/link'
import {
  IconUser,
  IconPhone,
  IconHome,
  IconChevronRight,
  IconCreditCard,
} from '@tabler/icons-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PAYMENT_STATUS_LABELS } from '@/constants'
import type { Tenant, Property, Contract, Payment } from '@/types'

type TenantWithRelations = Tenant & {
  property: Property
  contracts: Contract[]
  payments: Payment[]
}

export default function TenantCard({ tenant }: { tenant: TenantWithRelations }) {
  const lastPayment = tenant.payments[0]
  const hasActiveContract = tenant.contracts.length > 0

  return (
    <Link
      href={`/dashboard/tenants/${tenant.id}`}
      className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-200 hover:shadow-md transition-all duration-200 group block"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-bold text-sm">
          {tenant.firstName.charAt(0)}{tenant.lastName.charAt(0)}
        </div>
        <IconChevronRight
          size={18}
          className="text-gray-300 group-hover:text-green-500 transition-colors"
        />
      </div>

      {/* Nom */}
      <h3 className="font-semibold text-gray-900 mb-1">
        {tenant.firstName} {tenant.lastName}
      </h3>

      {/* Téléphone */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
        <IconPhone size={12} />
        {tenant.phone}
      </div>

      {/* Bien */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <IconHome size={12} />
        {tenant.property.name}
      </div>

      {/* Contrat & paiement */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
          hasActiveContract
            ? 'bg-green-50 text-green-600'
            : 'bg-gray-100 text-gray-400'
        }`}>
          {hasActiveContract ? 'Contrat actif' : 'Sans contrat'}
        </span>

        {lastPayment && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Dernier paiement</p>
            <p className={`text-xs font-medium ${
              lastPayment.status === 'PAID' ? 'text-green-600' :
              lastPayment.status === 'LATE' ? 'text-red-500' :
              lastPayment.status === 'PARTIAL' ? 'text-amber-500' :
              'text-gray-400'
            }`}>
              {PAYMENT_STATUS_LABELS[lastPayment.status as keyof typeof PAYMENT_STATUS_LABELS]}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}