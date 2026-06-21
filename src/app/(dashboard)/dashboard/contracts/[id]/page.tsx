import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft, IconUser, IconHome, IconCreditCard } from '@tabler/icons-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CONTRACT_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/constants'
import ContractStatusActions from '@/components/dashboard/ContractStatusActions'
import type { Payment } from '@/types'

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) return null

  const { id } = await params

  const contract = await prisma.contract.findFirst({
    where: { id, userId: session.user.id },
    include: {
      tenant: true,
      property: true,
      payments: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!contract) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/contracts"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-4"
        >
          <IconArrowLeft size={16} />
          Retour aux contrats
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
              {contract.property.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {contract.tenant.firstName} {contract.tenant.lastName}
            </p>
          </div>
          <span className={`text-xs font-medium px-3 py-1.5 rounded-lg flex-shrink-0 ${
            contract.status === 'ACTIVE'
              ? 'bg-green-50 text-green-600'
              : contract.status === 'EXPIRED'
              ? 'bg-gray-100 text-gray-500'
              : 'bg-red-50 text-red-500'
          }`}>
            {CONTRACT_STATUS_LABELS[contract.status as keyof typeof CONTRACT_STATUS_LABELS]}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Détails contrat */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Détails du contrat</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Loyer mensuel</span>
              <span className="text-sm font-bold text-green-600">
                {formatCurrency(contract.rentAmount)}
              </span>
            </div>
            {contract.deposit && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Caution</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(contract.deposit)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Date de début</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(contract.startDate)}
              </span>
            </div>
            {contract.endDate && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Date de fin</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(contract.endDate)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Locataire */}
        <Link
          href={`/dashboard/tenants/${contract.tenant.id}`}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-200 transition-colors"
        >
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
            <IconUser size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400">Locataire</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {contract.tenant.firstName} {contract.tenant.lastName}
            </p>
            <p className="text-xs text-gray-500">{contract.tenant.phone}</p>
          </div>
        </Link>

        {/* Bien */}
        <Link
          href={`/dashboard/properties/${contract.property.id}`}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-200 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <IconHome size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400">Bien</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {contract.property.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {contract.property.address}, {contract.property.city}
            </p>
          </div>
        </Link>

        {/* Paiements liés */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <IconCreditCard size={16} className="text-green-600" />
              Paiements
            </h2>
            <Link
              href={`/dashboard/payments/new`}
              className="text-xs text-green-600 hover:text-green-700 font-medium"
            >
              + Ajouter
            </Link>
          </div>

          {contract.payments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              Aucun paiement pour ce contrat
            </p>
          ) : (
            <div className="space-y-2">
              {(contract.payments as Payment[]).map((payment) => (
                <Link
                  key={payment.id}
                  href={`/dashboard/payments/${payment.id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                    payment.status === 'PAID'
                      ? 'bg-green-50 text-green-600'
                      : payment.status === 'LATE'
                      ? 'bg-red-50 text-red-500'
                      : payment.status === 'PARTIAL'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {PAYMENT_STATUS_LABELS[payment.status as keyof typeof PAYMENT_STATUS_LABELS]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Actions</h2>
          <ContractStatusActions contractId={contract.id} currentStatus={contract.status} />
        </div>
      </div>
    </div>
  )
}