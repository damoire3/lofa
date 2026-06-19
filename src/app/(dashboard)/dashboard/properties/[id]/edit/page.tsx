import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import PropertyEditForm from '@/components/forms/PropertyEditForm'

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) return null

  const { id } = await params

  const property = await prisma.property.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!property) notFound()

  // Récupère les propriétaires si gestionnaire
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
          href={`/dashboard/properties/${id}`}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-4"
        >
          <IconArrowLeft size={16} />
          Retour au bien
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Modifier le bien</h1>
        <p className="text-gray-500 mt-1">
          Modifiez les informations de votre bien immobilier
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <PropertyEditForm property={property} owners={owners} userRole={session.user.role} />
      </div>
    </div>
  )
}