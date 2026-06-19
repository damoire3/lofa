import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { IconPlus, IconUsers } from '@tabler/icons-react'
import { formatCurrency } from '@/lib/utils'
import type { Contract, Property } from '@/types'

export default async function TenantsPage() {
  const session = await auth()
  if (!session) return null

  const tenants = await prisma.tenant.findMany({
    where: { userId: session.user.id },
    include: {
      contracts: {
        where: { status: 'ACTIVE' },
        include: { property: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locataires</h1>
          <p className="text-gray-500 mt-1">
            {tenants.length} locataire{tenants.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/tenants/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <IconPlus size={18} />
          Ajouter
        </Link>
      </div>

      {tenants.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <IconUsers size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun locataire enregistré
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Ajoutez vos locataires pour suivre leurs contrats et paiements.
          </p>
          <Link
            href="/dashboard/tenants/new"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <IconPlus size={18} />
            Ajouter un locataire
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => {
            const activeContracts = tenant.contracts as (Contract & { property: Property })[]
            return (
              <Link
                key={tenant.id}
                href={`/dashboard/tenants/${tenant.id}`}
                className="bg-white border-2 border-gray-100 hover:border-green-200 hover:shadow-md rounded-2xl p-5 transition-all duration-200 block"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-bold text-sm">
                    {tenant.firstName.charAt(0)}{tenant.lastName.charAt(0)}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                    activeContracts.length > 0
                      ? 'bg-green-50 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {activeContracts.length > 0
                      ? `${activeContracts.length} bien${activeContracts.length > 1 ? 's' : ''}`
                      : 'Sans bien'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {tenant.firstName} {tenant.lastName}
                </h3>
                <p className="text-xs text-gray-400 mb-3">{tenant.phone}</p>

                {activeContracts.length > 0 && (
                  <div className="space-y-1">
                    {activeContracts.map((c) => (
                      <p key={c.id} className="text-xs text-gray-500 truncate">
                        {c.property.name} — {formatCurrency(c.rentAmount)}/mois
                      </p>
                    ))}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}