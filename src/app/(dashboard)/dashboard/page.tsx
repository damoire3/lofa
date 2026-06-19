import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import StatsCard from '@/components/dashboard/StatsCard'
import Link from 'next/link'
import {
  IconBuildingSkyscraper,
  IconUsers,
  IconCreditCard,
  IconAlertCircle,
  IconHandStop,
  IconPlus,
} from '@tabler/icons-react'
import { formatCurrency } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) return null

  const userId = session.user.id

  let propertiesCount = 0
  let tenantsCount = 0
  let totalCollected = 0
  let latePayments = 0

  try {
    const [props, tenants, payments] = await Promise.all([
      prisma.property.count({ where: { userId } }),
      prisma.tenant.count({ where: { userId } }),
      prisma.payment.findMany({
        where: { tenant: { userId } },
        select: { amount: true, status: true },
      }),
    ])

    propertiesCount = props
    tenantsCount = tenants
    totalCollected = payments
      .filter((p: { amount: number; status: string }) =>
        p.status === 'PAID' || p.status === 'PARTIAL'
      )
      .reduce((sum: number, p: { amount: number; status: string }) => sum + p.amount, 0)
    latePayments = payments.filter(
      (p: { amount: number; status: string }) => p.status === 'LATE'
    ).length
  } catch (error) {
    console.error('[DASHBOARD]', error)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Bonjour, {session.user.name?.split(' ')[0]}
          <IconHandStop size={24} color="#debd02" stroke={2} />
        </h1>
        <p className="text-gray-500 mt-1">
          Voici un aperçu de votre portefeuille immobilier
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Biens"
          value={propertiesCount}
          icon={<IconBuildingSkyscraper size={20} className="text-green-600" />}
          color="green"
        />
        <StatsCard
          title="Locataires"
          value={tenantsCount}
          icon={<IconUsers size={20} className="text-blue-600" />}
          color="blue"
        />
        <StatsCard
          title="Encaissé"
          value={formatCurrency(totalCollected)}
          icon={<IconCreditCard size={20} className="text-purple-600" />}
          color="purple"
        />
        <StatsCard
          title="Impayés"
          value={latePayments}
          icon={<IconAlertCircle size={20} className="text-red-600" />}
          color="red"
        />
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link
          href="/dashboard/properties/new"
          className="bg-white border-2 border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50 rounded-2xl p-5 flex items-center gap-3 transition-all group"
        >
          <div className="w-10 h-10 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center transition-colors">
            <IconPlus size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Ajouter un bien</p>
            <p className="text-xs text-gray-400">Enregistrer un nouveau bien</p>
          </div>
        </Link>

        <Link
          href="/dashboard/tenants/new"
          className="bg-white border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-2xl p-5 flex items-center gap-3 transition-all group"
        >
          <div className="w-10 h-10 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
            <IconPlus size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Ajouter un locataire</p>
            <p className="text-xs text-gray-400">Enregistrer un nouveau locataire</p>
          </div>
        </Link>

        <Link
          href="/dashboard/payments/new"
          className="bg-white border-2 border-dashed border-gray-200 hover:border-purple-400 hover:bg-purple-50 rounded-2xl p-5 flex items-center gap-3 transition-all group"
        >
          <div className="w-10 h-10 bg-purple-50 group-hover:bg-purple-100 rounded-xl flex items-center justify-center transition-colors">
            <IconPlus size={18} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Enregistrer un paiement</p>
            <p className="text-xs text-gray-400">Valider un loyer reçu</p>
          </div>
        </Link>
      </div>

      {/* Message si pas de biens */}
      {propertiesCount === 0 && (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <IconBuildingSkyscraper size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Commencez par ajouter un bien
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Ajoutez votre premier bien immobilier pour gérer vos locataires et paiements.
          </p>
          <Link
            href="/dashboard/properties/new"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <IconPlus size={18} />
            Ajouter un bien
          </Link>
        </div>
      )}
    </div>
  )
}