import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import {
  IconBuildingSkyscraper,
  IconUsers,
  IconCreditCard,
  IconAlertCircle,
} from '@tabler/icons-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PAYMENT_STATUS_LABELS } from '@/constants'
import type { Payment, Tenant, Contract } from '@/types'

export default async function OwnerPortalPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

const owner = await prisma.owner.findUnique({
  where: { token },
  include: {
    properties: {
      include: {
        contracts: {
          where: { status: 'ACTIVE' },
          include: {
            
            tenant: true,
            payments: {
              orderBy: { createdAt: 'desc' },
              take: 3,
            },
          },
          take: 1,
        },
      },
    },
  manager: {
  select: { name: true, logo: true }
},
  },
})

if (!owner) notFound()

const allPayments = owner.properties.flatMap((p) =>
  p.contracts.flatMap((c) => c.payments)
)

const totalCollected = allPayments
  .filter((p: Payment) => p.status === 'PAID' || p.status === 'PARTIAL')
  .reduce((sum: number, p: Payment) => sum + p.amount, 0)

const latePayments = allPayments.filter(
  (p: Payment) => p.status === 'LATE'
).length

const totalTenants = owner.properties.filter(
  (p) => p.contracts.length > 0
).length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-8 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-500/15 blur-[140px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-3">
    {owner.manager?.logo ? (
      <img
        src={owner.manager.logo}
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
    {owner.manager?.name && (
      <span className="text-white font-semibold text-sm">
        {owner.manager.name}
      </span>
    )}
  </div>
  <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
    Suivi propriétaire
  </span>
</div>
          <h1 className="text-xl font-bold">
            {owner.firstName} {owner.lastName}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Géré par {owner.manager.name}
          </p>
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

      {/* Contenu central — flex-1 pousse le footer en bas */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 flex-1 w-full">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <IconBuildingSkyscraper size={18} className="text-green-600 mb-2" />
            <p className="text-xl font-bold text-gray-900">
              {owner.properties.length}
            </p>
            <p className="text-xs text-gray-500">Biens</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <IconUsers size={18} className="text-blue-600 mb-2" />
            <p className="text-xl font-bold text-gray-900">{totalTenants}</p>
            <p className="text-xs text-gray-500">Locataires</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <IconCreditCard size={18} className="text-purple-600 mb-2" />
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(totalCollected)}
            </p>
            <p className="text-xs text-gray-500">Encaissé</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <IconAlertCircle size={18} className="text-red-500 mb-2" />
            <p className="text-xl font-bold text-gray-900">{latePayments}</p>
            <p className="text-xs text-gray-500">Impayés</p>
          </div>
        </div>

        {/* Biens */}
{owner.properties.map((property) => {
  const activeContract = property.contracts[0] as (Contract & {
    tenant: Tenant
    payments: Payment[]
  }) | undefined

  return (
    <div
      key={property.id}
      className="bg-white border border-gray-200 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{property.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {property.address}, {property.city}
          </p>
        </div>
        <span className="text-sm font-bold text-green-600">
          {formatCurrency(property.rentAmount)}/mois
        </span>
      </div>

      {activeContract ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {activeContract.tenant.firstName} {activeContract.tenant.lastName}
              </p>
              <p className="text-xs text-gray-500">{activeContract.tenant.phone}</p>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-lg bg-green-50 text-green-600">
              Contrat actif
            </span>
          </div>

          {activeContract.payments.length > 0 && (
            <div className="space-y-2">
              {activeContract.payments.map((payment: Payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-500">
                    {formatDate(payment.createdAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md font-medium ${
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
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-2">
          Aucun locataire
        </p>
      )}
    </div>
  )
})}
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