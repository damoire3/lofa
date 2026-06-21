import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft, IconCreditCard } from '@tabler/icons-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PAYMENT_STATUS_LABELS } from '@/constants'
import DownloadReceipt from '@/components/portal/DownloadReceipt'
import type { Payment, Contract, Property } from '@/types'

export default async function TenantPaymentsPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const tenant = await prisma.tenant.findUnique({
    where: { token },
    include: {
      user: { select: { logo: true, name: true } },
      payments: {
        orderBy: { createdAt: 'desc' },
        include: { contract: { include: { property: true } } },
      },
    },
  })

  if (!tenant) notFound()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-8 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-500/15 blur-[140px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto">
          <Link
            href={`/portal/${token}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-4"
          >
            <IconArrowLeft size={16} />
            Retour au portail
          </Link>
          <h1 className="text-xl font-bold">Historique des paiements</h1>
          <p className="text-gray-400 text-sm mt-1">
            {tenant.payments.length} paiement{tenant.payments.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 120" className="w-full h-[60px]" preserveAspectRatio="none">
            <path
              fill="#f9fafb"
              d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,74.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-3 flex-1 w-full">
        {tenant.payments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <IconCreditCard size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Aucun paiement enregistré</p>
          </div>
        ) : (
          (tenant.payments as (Payment & { contract: Contract & { property: Property } })[]).map((payment) => (
            <div key={payment.id} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(payment.amount)}
                    {payment.expectedAmount > payment.amount && (
                      <span className="text-xs text-amber-500 ml-1">
                        / {formatCurrency(payment.expectedAmount)}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {payment.contract.property.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-lg flex-shrink-0 ${
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

              {(payment.status === 'PAID' || payment.status === 'PARTIAL') && (
                <DownloadReceipt
                  data={{
                    tenant,
                    payment,
                    contract: payment.contract,
                    userLogo: tenant.user?.logo,
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white px-4 pt-16 pb-8">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg viewBox="0 0 1440 120" className="w-full h-[60px]" preserveAspectRatio="none">
            <path
              fill="#f9fafb"
              d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,74.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
        <div className="relative z-10 text-center">
          <a href="/" className="text-lg font-bold tracking-tight text-white">
            lo<span className="text-green-400">fa</span>
          </a>
          <p className="text-gray-500 text-xs mt-2">Gestion immobilière simplifiée</p>
        </div>
      </div>
    </div>
  )
}