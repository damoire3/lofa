import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import PaymentForm from '@/components/forms/PaymentForm'

export default async function NewPaymentPage() {
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
    orderBy: { firstName: 'asc' },
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/payments"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-4"
        >
          <IconArrowLeft size={16} />
          Retour aux paiements
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Enregistrer un paiement
        </h1>
        <p className="text-gray-500 mt-1">
          Enregistrez un paiement de loyer en espèces ou Mobile Money
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <PaymentForm tenants={tenants} userPlan={session.user.plan} />
      </div>
    </div>
  )
}