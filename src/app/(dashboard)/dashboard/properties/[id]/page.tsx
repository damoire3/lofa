import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  IconArrowLeft,
  IconEdit,
  IconMapPin,
  IconUsers,
  IconFileText,
  IconCreditCard,
} from '@tabler/icons-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PROPERTY_TYPE_LABELS, CONTRACT_STATUS_LABELS } from '@/constants'
import type { Contract, Tenant } from '@/types'

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) return null

  const { id } = await params

const property = await prisma.property.findFirst({
  where: { id, userId: session.user.id },
  include: {
    contracts: {
      orderBy: { createdAt: 'desc' },
      include: { tenant: true },
    },
  },
})

  if (!property) notFound()

  const activeContract = property.contracts.find(
    (c: Contract) => c.status === 'ACTIVE'
  )
const activeTenant = property.contracts.find(
  (c: Contract) => c.status === 'ACTIVE'
) as (Contract & { tenant: Tenant }) | undefined

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/properties"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-4"
        >
          <IconArrowLeft size={16} />
          Retour aux biens
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <IconMapPin size={14} className="text-gray-400" />
              <p className="text-gray-500 text-sm">
                {property.address}, {property.city}
              </p>
            </div>
          </div>
          <Link
            href={`/dashboard/properties/${id}/edit`}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <IconEdit size={16} />
            Modifier
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Infos */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Informations</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className="text-sm font-medium text-gray-900">
                  {PROPERTY_TYPE_LABELS[property.type]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Loyer mensuel</span>
                <span className="text-sm font-bold text-green-600">
                  {formatCurrency(property.rentAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Statut</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                  activeContract
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {activeContract ? 'Occupé' : 'Libre'}
                </span>
              </div>
            </div>
          </div>

          {/* Locataire actuel */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Locataire</h2>
              {!activeTenant && (
                <Link
                  href={`/dashboard/tenants/new`}
                  className="text-xs text-green-600 hover:text-green-700 font-medium"
                >
                  + Ajouter
                </Link>
              )}
            </div>

{activeTenant ? (
  <Link
    href={`/dashboard/tenants/${activeTenant.tenant.id}`}
    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
  >
    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600 font-bold text-xs">
      {activeTenant.tenant.firstName.charAt(0)}{activeTenant.tenant.lastName.charAt(0)}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-900">
        {activeTenant.tenant.firstName} {activeTenant.tenant.lastName}
      </p>
      <p className="text-xs text-gray-500">{activeTenant.tenant.phone}</p>
    </div>
  </Link>
) : (
  <div className="text-center py-4">
    <IconUsers size={24} className="text-gray-300 mx-auto mb-2" />
    <p className="text-xs text-gray-400">Aucun locataire</p>
  </div>
)}
          </div>
        </div>

        {/* Contrats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Contrats</h2>
              <Link
                href="/dashboard/contracts/new"
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                + Nouveau contrat
              </Link>
            </div>

            {property.contracts.length === 0 ? (
              <div className="text-center py-8">
                <IconFileText size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Aucun contrat</p>
              </div>
            ) : (
              <div className="space-y-3">
                {property.contracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {(contract as Contract & { tenant: Tenant }).tenant.firstName}{' '}
                        {(contract as Contract & { tenant: Tenant }).tenant.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(contract.rentAmount)}/mois · Depuis le {formatDate(contract.startDate)}
                      </p>
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