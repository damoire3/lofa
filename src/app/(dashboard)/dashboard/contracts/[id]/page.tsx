import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      tenant: true,
      property: true,
    },
  })

  if (!contract) {
    notFound()
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/dashboard/contracts" className="text-sm text-green-600 hover:underline">
        ← Retour aux contrats
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-6">
        Contrat — {contract.property?.name ?? 'Bien'}
      </h1>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <div>
  <p className="text-sm text-gray-500">Locataire</p>
  <p className="font-semibold text-gray-900">
    {contract.tenant?.firstName} {contract.tenant?.lastName}
  </p>
</div>
        <div>
          <p className="text-sm text-gray-500">Loyer mensuel</p>
          <p className="font-semibold text-gray-900">{contract.rentAmount} F CFA</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date de début</p>
          <p className="font-semibold text-gray-900">
            {new Date(contract.startDate).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date de fin</p>
          <p className="font-semibold text-gray-900">
            {contract.endDate ? new Date(contract.endDate).toLocaleDateString('fr-FR') : '—'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Statut</p>
          <p className="font-semibold text-gray-900">{contract.status}</p>
        </div>
      </div>
    </div>
  )
}