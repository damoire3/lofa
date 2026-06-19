import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { IconPlus, IconUserCircle } from '@tabler/icons-react'
import { redirect } from 'next/navigation'

export default async function OwnersPage() {
  const session = await auth()
  if (!session) return null

  if (session.user.role !== 'MANAGER') {
    redirect('/dashboard')
  }

  const owners = await prisma.owner.findMany({
    where: { managerId: session.user.id },
    include: {
      properties: {
        include: {
          contracts: {
            where: { status: 'ACTIVE' },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propriétaires</h1>
          <p className="text-gray-500 mt-1">
            {owners.length} propriétaire{owners.length > 1 ? 's' : ''} enregistré{owners.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/owners/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <IconPlus size={18} />
          Ajouter un propriétaire
        </Link>
      </div>

      {owners.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <IconUserCircle size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun propriétaire enregistré
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Ajoutez les propriétaires dont vous gérez les biens.
          </p>
          <Link
            href="/dashboard/owners/new"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <IconPlus size={18} />
            Ajouter un propriétaire
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {owners.map((owner) => {
            const totalProperties = owner.properties.length
            const totalTenants = owner.properties.filter(
              (p) => p.contracts.length > 0
            ).length
            return (
              <Link
                key={owner.id}
                href={`/dashboard/owners/${owner.id}`}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-200 hover:shadow-md transition-all duration-200 group block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-bold text-sm">
                    {owner.firstName.charAt(0)}{owner.lastName.charAt(0)}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {owner.firstName} {owner.lastName}
                </h3>
                <p className="text-xs text-gray-400 mb-4">{owner.phone}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{totalProperties} bien{totalProperties > 1 ? 's' : ''}</span>
                  <span>{totalTenants} occupé{totalTenants > 1 ? 's' : ''}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}