import ContractForm from '@/components/forms/ContractForm'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: Promise<{ tenantId?: string }>
}) {
  const session = await auth()
  if (!session) return null

  const { tenantId } = await searchParams

  const [tenants, properties] = await Promise.all([
    prisma.tenant.findMany({
      where: { userId: session.user.id },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: 'asc' },
    }),
    prisma.property.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true, rentAmount: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/contracts"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-4"
        >
          <IconArrowLeft size={16} />
          Retour aux contrats
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau contrat</h1>
        <p className="text-gray-500 mt-1">
          Créez un contrat de bail pour un locataire
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <ContractForm
          tenants={tenants}
          properties={properties}
          defaultTenantId={tenantId}
        />
      </div>
    </div>
  )
}