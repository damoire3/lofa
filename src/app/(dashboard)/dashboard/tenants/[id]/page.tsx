import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  IconArrowLeft,
  IconPhone,
  IconMail,
  IconHome,
  IconFileText,
  IconCreditCard,
  IconLink,
  IconPlus,
} from '@tabler/icons-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PAYMENT_STATUS_LABELS, CONTRACT_STATUS_LABELS } from '@/constants'
import { buildTenantPortalUrl } from '@/lib/tokens'
import type { Contract, Payment, Property } from '@/types'

export default async function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) return null

  const { id } = await params

  const tenant = await prisma.tenant.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      contracts: {
        orderBy: { createdAt: 'desc' },
        include: { property: true },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        include: { contract: { include: { property: true } } },
      },
    },
  })

  if (!tenant) notFound()

  const portalUrl = buildTenantPortalUrl(tenant.token)
  const activeContracts = tenant.contracts.filter(
    (c) => c.status === 'ACTIVE'
  ) as (Contract & { property: Property })[]

  const totalPaid = tenant.payments
    .filter((p: Payment) => p.status === 'PAID' || p.status === 'PARTIAL')
    .reduce((sum: number, p: Payment) => sum + p.amount, 0)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/tenants"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-4"
        >
          <IconArrowLeft size={16} />
          Retour aux locataires
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 font-bold text-lg">
              {tenant.firstName.charAt(0)}{tenant.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {tenant.firstName} {tenant.lastName}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {activeContracts.length > 0
                  ? `${activeContracts.length} bien${activeContracts.length > 1 ? 's' : ''} loué${activeContracts.length > 1 ? 's' : ''}`
                  : 'Aucun bien loué actuellement'}
              </p>
            </div>
          </div>

          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-green-200"
          >
            <IconLink size={16} />
            Portail locataire
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Infos */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Informations</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <IconPhone size={16} className="text-gray-400" />
                <span className="text-sm text-gray-700">{tenant.phone}</span>
              </div>
              {tenant.email && (
                <div className="flex items-center gap-3">
                  <IconMail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{tenant.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Résumé</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total encaissé</span>
                <span className="text-sm font-bold text-green-600">
                  {formatCurrency(totalPaid)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Paiements</span>
                <span className="text-sm font-medium text-gray-900">
                  {tenant.payments.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Biens loués</span>
                <span className="text-xs font-medium px-2 py-1 rounded-lg bg-green-50 text-green-600">
                  {activeContracts.length}
                </span>
              </div>
            </div>
          </div>

          {/* Lien portail */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-900 mb-2">Lien portail</h2>
            <p className="text-xs text-gray-500 mb-3">
              Partagez ce lien avec le locataire via WhatsApp ou SMS
            </p>
            <div className="bg-gray-50 rounded-xl p-3 break-all text-xs text-gray-600 font-mono">
              {portalUrl}
            </div>
          </div>
        </div>

        {/* Contrats & Paiements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contrats */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Biens loués</h2>
              <Link
                href={`/dashboard/contracts/new?tenantId=${tenant.id}`}
                className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
              >
                <IconPlus size={14} />
                Ajouter un bien
              </Link>
            </div>

            {tenant.contracts.length === 0 ? (
              <div className="text-center py-8">
                <IconFileText size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Aucun bien loué pour le moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(tenant.contracts as (Contract & { property: Property })[]).map((contract) => (
                  <Link
                    key={contract.id}
                    href={`/dashboard/properties/${contract.property.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <IconHome size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {contract.property.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(contract.rentAmount)}/mois · Depuis le {formatDate(contract.startDate)}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                      contract.status === 'ACTIVE'
                        ? 'bg-green-50 text-green-600'
                        : contract.status === 'EXPIRED'
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-red-50 text-red-500'
                    }`}>
                      {CONTRACT_STATUS_LABELS[contract.status as keyof typeof CONTRACT_STATUS_LABELS]}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Paiements */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Paiements récents</h2>
              <Link
                href={`/dashboard/payments?tenantId=${tenant.id}`}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Voir tout
              </Link>
            </div>

            {tenant.payments.length === 0 ? (
              <div className="text-center py-8">
                <IconCreditCard size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Aucun paiement</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(tenant.payments.slice(0, 5) as (Payment & { contract: Contract & { property: Property } })[]).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                        {payment.expectedAmount > payment.amount && (
                          <span className="text-xs text-amber-500 ml-1">
                            / {formatCurrency(payment.expectedAmount)}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.contract.property.name} · {formatDate(payment.createdAt)}
                      </p>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}