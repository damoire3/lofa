import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import {
  IconHome,
  IconPhone,
  IconCreditCard,
  IconFileText,
} from '@tabler/icons-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PAYMENT_STATUS_LABELS, CONTRACT_STATUS_LABELS } from '@/constants'
import type { Payment, Contract, Property } from '@/types'
import DownloadReceipt from '@/components/portal/DownloadReceipt'
import PayOnline from '@/components/portal/PayOnline'

export default async function TenantPortalPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

const tenant = await prisma.tenant.findUnique({
  where: { token },
  include: {
    user: { select: { logo: true, name: true } },
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

  const activeContracts = tenant.contracts.filter(
    (c) => c.status === 'ACTIVE'
  ) as (Contract & { property: Property })[]

  const totalPaid = tenant.payments
    .filter((p: Payment) => p.status === 'PAID' || p.status === 'PARTIAL')
    .reduce((sum: number, p: Payment) => sum + p.amount, 0)

  const pendingAmount = tenant.payments
    .filter((p: Payment) => p.status === 'PENDING' || p.status === 'LATE' || p.status === 'PARTIAL')
    .reduce((sum: number, p: Payment) => sum + (p.expectedAmount - p.amount), 0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-8 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-500/15 blur-[140px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-3">
    {tenant.user?.logo ? (
      <img
        src={tenant.user.logo}
        alt="Logo"
        className="h-8 object-contain"
      />
    ) : (
      <a
        href="/"
        className="text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity"
      >
        lo<span className="text-green-400">fa</span>
      </a>
    )}
    {tenant.user?.name && (
      <span className="text-white font-semibold text-sm">
        {tenant.user.name}
      </span>
    )}
  </div>
  <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
    Portail locataire
  </span>
</div>
          <h1 className="text-xl font-bold">
            {tenant.firstName} {tenant.lastName}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <IconHome size={14} className="text-gray-400" />
            <p className="text-gray-400 text-sm">
              {activeContracts.length > 0
                ? `${activeContracts.length} bien${activeContracts.length > 1 ? 's' : ''} loué${activeContracts.length > 1 ? 's' : ''}`
                : 'Aucun bien actif'}
            </p>
          </div>
        </div>

        {/* Courbe bas */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 120" className="w-full h-[60px]" preserveAspectRatio="none">
            <path
              fill="#f9fafb"
              d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,74.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      {/* Contenu central */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4 flex-1 w-full">
        {/* Résumé financier */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">Total payé</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">Solde dû</p>
            <p className={`text-lg font-bold ${
              pendingAmount > 0 ? 'text-red-500' : 'text-gray-400'
            }`}>
              {formatCurrency(pendingAmount)}
            </p>
          </div>
        </div>

        {/* Paiement en ligne — pour chaque contrat actif */}
{activeContracts.map((contract) => (
  <div key={contract.id} className="bg-white border border-gray-200 rounded-2xl p-5">
    <h2 className="font-semibold text-gray-900 mb-3">
      Payer — {contract.property.name}
    </h2>
    <p className="text-xs text-gray-500 mb-3">
      Loyer mensuel : {formatCurrency(contract.rentAmount)}
    </p>
    <PayOnline
      tenantId={tenant.id}
      tenantPhone={tenant.phone}
      contract={contract}
    />
  </div>
))}

        {/* Biens loués */}
        {activeContracts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <IconFileText size={16} className="text-green-600" />
              {activeContracts.length > 1 ? 'Biens loués' : 'Contrat en cours'}
            </h2>
            <div className="space-y-3">
              {activeContracts.map((contract) => (
                <div key={contract.id} className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {contract.property.name}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 rounded-lg bg-green-50 text-green-600">
                      {CONTRACT_STATUS_LABELS[contract.status as keyof typeof CONTRACT_STATUS_LABELS]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Loyer mensuel</span>
                    <span className="text-xs font-bold text-gray-900">
                      {formatCurrency(contract.rentAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Depuis le</span>
                    <span className="text-xs text-gray-700">
                      {formatDate(contract.startDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historique paiements */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <IconCreditCard size={16} className="text-green-600" />
            Historique des paiements
          </h2>

          {tenant.payments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              Aucun paiement enregistré
            </p>
          ) : (
            <div className="space-y-3">
              {(tenant.payments as (Payment & { contract: Contract & { property: Property } })[]).map((payment) => (
                <div
                  key={payment.id}
                  className="p-3 bg-gray-50 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
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
              ))}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Contact</h2>
          <div className="flex items-center gap-3">
            <IconPhone size={16} className="text-gray-400" />
            <span className="text-sm text-gray-700">{tenant.phone}</span>
          </div>
        </div>
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
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-green-500/10 blur-[120px] rounded-full" />
        </div>
        <div className="relative z-10 text-center">
          <a href="/" className="text-lg font-bold tracking-tight text-white">
            lo<span className="text-green-400">fa</span>
          </a>
          <p className="text-gray-500 text-xs mt-2">
            Gestion immobilière simplifiée
          </p>
        </div>
      </div>
    </div>
  )
}