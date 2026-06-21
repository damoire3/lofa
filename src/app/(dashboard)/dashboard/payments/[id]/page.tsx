import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft, IconUser, IconHome, IconCalendar } from '@tabler/icons-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PAYMENT_STATUS_LABELS } from '@/constants'
import PaymentStatusActions from '@/components/dashboard/PaymentStatusActions'

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) return null

  const { id } = await params

  const payment = await prisma.payment.findFirst({
    where: { id, tenant: { userId: session.user.id } },
    include: {
      tenant: true,
      contract: { include: { property: true } },
    },
  })

  if (!payment) notFound()

  const methodLabel =
    payment.method === 'MOBILE_MONEY' ? 'Mobile Money' :
    payment.method === 'CASH' ? 'Espèces' : 'Virement bancaire'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/payments"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-4"
        >
          <IconArrowLeft size={16} />
          Retour aux paiements
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {formatCurrency(payment.amount)}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {payment.contract.property.name} · {methodLabel}
            </p>
          </div>
          <span className={`text-xs font-medium px-3 py-1.5 rounded-lg flex-shrink-0 ${
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
      </div>

      <div className="space-y-4">
        {/* Infos */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Détails</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Montant reçu</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(payment.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Montant attendu</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(payment.expectedAmount)}
              </span>
            </div>
            {payment.expectedAmount > payment.amount && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Solde restant</span>
                <span className="text-sm font-bold text-amber-600">
                  {formatCurrency(payment.expectedAmount - payment.amount)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Méthode</span>
              <span className="text-sm font-medium text-gray-900">{methodLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Date d&apos;échéance</span>
              <span className="text-sm font-medium text-gray-900">
                {formatDate(payment.dueDate)}
              </span>
            </div>
            {payment.paidAt && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Date de paiement</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(payment.paidAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Locataire */}
        <Link
          href={`/dashboard/tenants/${payment.tenant.id}`}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-200 transition-colors"
        >
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
            <IconUser size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400">Locataire</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {payment.tenant.firstName} {payment.tenant.lastName}
            </p>
          </div>
        </Link>

        {/* Bien */}
        <Link
          href={`/dashboard/properties/${payment.contract.property.id}`}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-200 transition-colors"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <IconHome size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400">Bien</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {payment.contract.property.name}
            </p>
          </div>
        </Link>

        {/* Actions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <IconCalendar size={16} className="text-green-600" />
            Actions
          </h2>
          <PaymentStatusActions paymentId={payment.id} currentStatus={payment.status} />
        </div>
      </div>
    </div>
  )
}