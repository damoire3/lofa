import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { IconPlus, IconCreditCard } from '@tabler/icons-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PAYMENT_STATUS_LABELS } from '@/constants'
import type { Payment, Tenant, Contract, Property } from '@/types'

export default async function PaymentsPage() {
  const session = await auth()
  if (!session) return null

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

  const latePayments = payments.filter((p: Payment) => p.status === 'LATE').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
          <p className="text-gray-500 mt-1">
            {payments.length} paiement{payments.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/payments/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <IconPlus size={18} />
          <span className="hidden sm:inline">Enregistrer un paiement</span>
          <span className="sm:hidden">Ajouter</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4">
          <p className="text-sm text-gray-500">Total encaissé</p>
          <p className="text-xl font-bold text-green-600 mt-1 truncate">
            {formatCurrency(totalCollected)}
          </p>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4">
          <p className="text-sm text-gray-500">Impayés</p>
          <p className="text-xl font-bold text-red-500 mt-1">{latePayments}</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <IconCreditCard size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun paiement enregistré
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Enregistrez les paiements de vos locataires.
          </p>
          <Link
            href="/dashboard/payments/new"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <IconPlus size={18} />
            Enregistrer un paiement
          </Link>
        </div>
      ) : (
        <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Locataire</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Bien</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Méthode</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(payments as (Payment & { tenant: Tenant; contract: Contract & { property: Property } })[]).map((payment) => (
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
                        {payment.method === 'MOBILE_MONEY' ? 'Mobile Money' :
                         payment.method === 'CASH' ? 'Espèces' : 'Virement'}
                      </p>
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
        </div>
      )}
    </div>
  )
}