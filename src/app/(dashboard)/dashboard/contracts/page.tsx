import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { IconPlus, IconFileText } from '@tabler/icons-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CONTRACT_STATUS_LABELS } from '@/constants'
import type { ContractWithRelations } from '@/types'

export default async function ContractsPage() {
  const session = await auth()
  if (!session) return null

  const contracts = await prisma.contract.findMany({
    where: { userId: session.user.id },
    include: {
      tenant: true,
      property: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contrats</h1>
          <p className="text-gray-500 mt-1">
            {contracts.length} contrat{contracts.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/contracts/new"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
        >
          <IconPlus size={18} />
          Nouveau contrat
        </Link>
      </div>

      {contracts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <IconFileText size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun contrat
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Créez un contrat de bail pour vos locataires.
          </p>
          <Link
            href="/dashboard/contracts/new"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <IconPlus size={18} />
            Nouveau contrat
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Locataire</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bien</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Loyer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Début</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contracts.map((contract: ContractWithRelations) => (
                <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {contract.tenant.firstName} {contract.tenant.lastName}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-600">{contract.property.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(contract.rentAmount)}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-600">{formatDate(contract.startDate)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                      contract.status === 'ACTIVE'
                        ? 'bg-green-50 text-green-600'
                        : contract.status === 'EXPIRED'
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-red-50 text-red-500'
                    }`}>
                      {CONTRACT_STATUS_LABELS[contract.status as keyof typeof CONTRACT_STATUS_LABELS]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}