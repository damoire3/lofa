import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import {
  IconArrowLeft,
  IconPhone,
  IconMail,
  IconBuildingSkyscraper,
  IconLink,
} from '@tabler/icons-react'
import { formatCurrency } from '@/lib/utils'
import { buildOwnerPortalUrl } from '@/lib/tokens'
import AttachPropertyForm from '@/components/forms/AttachPropertyForm'

export default async function OwnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) return null

  if (session.user.role !== 'MANAGER') {
    redirect('/dashboard')
  }

  const { id } = await params

const owner = await prisma.owner.findFirst({
  where: { id, managerId: session.user.id },
  include: {
    properties: {
      include: {
        contracts: {
          where: { status: 'ACTIVE' },
          include: {
            tenant: true,
            payments: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
          take: 1,
        },
      },
    },
  },
})

if (!owner) notFound()

const unassignedProperties = await prisma.property.findMany({
  where: {
    userId: session.user.id,
    ownerId: null,
  },
  select: { id: true, name: true, city: true, rentAmount: true },
  orderBy: { name: 'asc' },
})

const portalUrl = buildOwnerPortalUrl(owner.token)
const totalProperties = owner.properties.length
const totalTenants = owner.properties.filter(
  (p) => p.contracts.length > 0
).length
const totalRevenue = owner.properties.reduce((sum, p) => {
  const contract = p.contracts[0]
  const lastPayment = contract?.payments[0]
  return sum + (lastPayment?.amount || 0)
}, 0)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/owners"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-4"
        >
          <IconArrowLeft size={16} />
          Retour aux propriétaires
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 font-bold text-lg">
              {owner.firstName.charAt(0)}{owner.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {owner.firstName} {owner.lastName}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {totalProperties} bien{totalProperties > 1 ? 's' : ''} · {totalTenants} locataire{totalTenants > 1 ? 's' : ''}
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
            Portail suivi
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
                <span className="text-sm text-gray-700">{owner.phone}</span>
              </div>
              {owner.email && (
                <div className="flex items-center gap-3">
                  <IconMail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{owner.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Résumé</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Biens</span>
                <span className="text-sm font-medium text-gray-900">{totalProperties}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Locataires</span>
                <span className="text-sm font-medium text-gray-900">{totalTenants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Dernier encaissement</span>
                <span className="text-sm font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
            </div>
          </div>

          {/* Lien portail */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-900 mb-2">Lien de suivi</h2>
            <p className="text-xs text-gray-500 mb-3">
              Partagez ce lien avec le propriétaire
            </p>
            <div className="bg-gray-50 rounded-xl p-3 break-all text-xs text-gray-600 font-mono">
              {portalUrl}
            </div>
          </div>
        </div>

        {/* Biens gérés — avec rattachement + création */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Biens gérés</h2>

            {owner.properties.length === 0 ? (
              <div className="text-center py-8">
                <IconBuildingSkyscraper size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Aucun bien rattaché</p>
              </div>
            ) : (
              <div className="space-y-3 mb-5">
{owner.properties.map((property) => {
  const activeContract = property.contracts[0]
  const hasContract = !!activeContract
  return (
    <Link
      key={property.id}
      href={`/dashboard/properties/${property.id}`}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
    >
      <div>
        <p className="text-sm font-medium text-gray-900">
          {property.name}
        </p>
        <p className="text-xs text-gray-500">
          {property.city} · {formatCurrency(property.rentAmount)}/mois
        </p>
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
        hasContract
          ? 'bg-green-50 text-green-600'
          : 'bg-gray-100 text-gray-400'
      }`}>
        {hasContract ? 'Occupé' : 'Libre'}
      </span>
    </Link>
  )
})}
              </div>
            )}

            {/* Rattacher ou créer un bien */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Ajouter un bien à ce propriétaire
              </p>
              <AttachPropertyForm
                ownerId={owner.id}
                properties={unassignedProperties}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}