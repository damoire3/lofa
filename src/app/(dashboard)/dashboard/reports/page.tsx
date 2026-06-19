import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PAYMENT_STATUS_LABELS } from '@/constants'
import { IconChartBar, IconLock } from '@tabler/icons-react'
import ExportExcel from '@/components/dashboard/ExportExcel'
import type { Payment, Tenant } from '@/types'

export default async function ReportsPage() {
  const session = await auth()
  if (!session) return null

  // Rapports disponibles seulement pour Pro et Agency
  if (session.user.plan === 'FREE' || !session.user.plan) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <IconLock size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Fonctionnalité Pro
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Les rapports détaillés sont disponibles à partir du plan Pro.
          </p>
          <a
            href="/#pricing"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Voir les plans
          </a>
        </div>
      </div>
    )
  }

  const payments = await prisma.payment.findMany({
    where: { tenant: { userId: session.user.id } },
    include: {
      tenant: true,
      contract: { include: { property: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalCollected = payments
    .filter((p: Payment) => p.status === 'PAID' || p.status === 'PARTIAL')
    .reduce((sum: number, p: Payment) => sum + p.amount, 0)

  const totalPending = payments
    .filter((p: Payment) => p.status === 'PENDING' || p.status === 'LATE')
    .reduce((sum: number, p: Payment) => sum + p.expectedAmount - p.amount, 0)

  const totalLate = payments.filter((p: Payment) => p.status === 'LATE').length
  const totalPaid = payments.filter((p: Payment) => p.status === 'PAID').length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-500 mt-1">Vue d&apos;ensemble de vos finances</p>
        </div>
        <ExportExcel payments={payments} />
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total encaissé</p>
          <p className="text-xl font-bold text-green-600">
            {formatCurrency(totalCollected)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">En attente</p>
          <p className="text-xl font-bold text-amber-500">
            {formatCurrency(totalPending)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">Paiements reçus</p>
          <p className="text-xl font-bold text-gray-900">{totalPaid}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">Impayés</p>
          <p className="text-xl font-bold text-red-500">{totalLate}</p>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconChartBar size={18} className="text-green-600" />
            <h2 className="font-semibold text-gray-900">Historique complet</h2>
          </div>
          <span className="text-xs text-gray-400">
            {payments.length} paiement{payments.length > 1 ? 's' : ''}
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucun paiement enregistré</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Locataire</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Bien</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(payments as (Payment & { tenant: Tenant; contract: { property: { name: string } } })[]).map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {payment.tenant.firstName} {payment.tenant.lastName}
                      </p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-600 truncate max-w-[140px]">
                        {payment.contract.property.name}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </p>
                      {payment.expectedAmount > payment.amount && (
                        <p className="text-xs text-amber-500">
                          / {formatCurrency(payment.expectedAmount)}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-600">
                        {formatDate(payment.createdAt)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap ${
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
