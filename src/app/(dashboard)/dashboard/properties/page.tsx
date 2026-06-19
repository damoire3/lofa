import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { IconPlus, IconBuildingSkyscraper } from '@tabler/icons-react'
import PropertyCard from '@/components/dashboard/PropertyCard'
import type { PropertyWithRelations } from '@/types'

export default async function PropertiesPage() {
  const session = await auth()
  if (!session) return null

  const properties = await prisma.property.findMany({
    where: { userId: session.user.id },
    include: {
      contracts: {
        where: { status: 'ACTIVE' },
        include: { tenant: true },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biens immobiliers</h1>
          <p className="text-gray-500 mt-1">
            {properties.length} bien{properties.length > 1 ? 's' : ''} enregistré{properties.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <IconPlus size={18} />
          Ajouter un bien
        </Link>
      </div>

      {/* Liste des biens */}
      {properties.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <IconBuildingSkyscraper size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun bien enregistré
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Ajoutez votre premier bien immobilier pour commencer.
          </p>
          <Link
            href="/dashboard/properties/new"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <IconPlus size={18} />
            Ajouter un bien
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property: PropertyWithRelations) => (
         <PropertyCard key={property.id} property={property} />
      ))}
        </div>
      )}
    </div>
  )
}