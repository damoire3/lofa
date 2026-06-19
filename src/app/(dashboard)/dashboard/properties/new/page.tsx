import PropertyForm from '@/components/forms/PropertyForm'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function NewPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ ownerId?: string }>
}) {
  const session = await auth()
  if (!session) return null

  const { ownerId } = await searchParams

  const owners = session.user.role === 'MANAGER'
    ? await prisma.owner.findMany({
        where: { managerId: session.user.id },
        select: { id: true, firstName: true, lastName: true },
        orderBy: { firstName: 'asc' },
      })
    : []

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/properties"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-4"
        >
          <IconArrowLeft size={16} />
          Retour aux biens
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Ajouter un bien</h1>
        <p className="text-gray-500 mt-1">
          Renseignez les informations de votre bien immobilier
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <PropertyForm owners={owners} userRole={session.user.role} defaultOwnerId={ownerId} />
      </div>
    </div>
  )
}