import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PLANS } from '@/constants/plans'
import { ROLE_LABELS } from '@/constants'
import { IconUser, IconCreditCard, IconShield, IconPhoto } from '@tabler/icons-react'
import LogoUpload from '@/components/dashboard/LogoUpload'
import type { Plan, Role } from '@/types'
import ProfileForm from '@/components/dashboard/ProfileForm'

export default async function SettingsPage() {
  const session = await auth()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { logo: true },
  })

  const plan = PLANS[session.user.plan as Plan] ?? PLANS['FREE']

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 mt-1">Gérez votre compte et votre abonnement</p>
      </div>

      <div className="space-y-4">
        {/* Logo */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <IconPhoto size={18} className="text-green-600" />
            <h2 className="font-semibold text-gray-900">Logo</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Votre logo apparaîtra sur les quittances PDF et les portails.
          </p>
          <LogoUpload
  currentLogo={user?.logo}
  agencyName={session.user.name ?? ''}
/>
        </div>

        {/* Profil */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
  <div className="flex items-center gap-3 mb-4">
    <IconUser size={18} className="text-green-600" />
    <h2 className="font-semibold text-gray-900">Profil</h2>
  </div>
  <ProfileForm
    currentName={session.user.name ?? ''}
    currentEmail={session.user.email ?? ''}
  />

</div>

        {/* Plan */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <IconCreditCard size={18} className="text-green-600" />
            <h2 className="font-semibold text-gray-900">Abonnement</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Plan actuel</span>
              <span className="text-sm font-bold text-green-600">{plan.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Biens max</span>
              <span className="text-sm font-medium text-gray-900">
                {plan.limits.properties === Infinity ? 'Illimité' : plan.limits.properties}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Locataires max</span>
              <span className="text-sm font-medium text-gray-900">
                {plan.limits.tenants === Infinity ? 'Illimité' : plan.limits.tenants}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Commission</span>
              <span className="text-sm font-medium text-gray-900">
                {plan.commission > 0 ? `${plan.commission * 100}%` : 'Aucune'}
              </span>
            </div>
          </div>

          {session.user.plan === 'FREE' && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-700 font-medium mb-2">
                Passez au plan Pro
              </p>
              <p className="text-xs text-green-600 mb-3">
                Gérez jusqu&apos;à 15 biens sans commission sur les loyers.
              </p>
              <a
                href="/#pricing"
                className="inline-flex items-center text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Voir les plans
              </a>
            </div>
          )}
        </div>

        {/* Sécurité */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <IconShield size={18} className="text-green-600" />
            <h2 className="font-semibold text-gray-900">Sécurité</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">Déconnexion automatique</p>
                <p className="text-xs text-gray-500">Après 30 minutes d&apos;inactivité</p>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-lg bg-green-50 text-green-600">
                Activé
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}