 
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import NotificationTemplatesForm from '@/components/dashboard/NotificationTemplatesForm'

export default async function NotificationSettingsPage() {
  const session = await auth()
  if (!session) return null

  const templates = await prisma.notificationTemplate.findMany({
    where: { userId: session.user.id },
  })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Modèles de notifications
        </h1>
        <p className="text-gray-500 mt-1">
          Personnalisez les messages envoyés à vos locataires
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <p className="text-sm text-blue-700 font-medium mb-1">
          Variables disponibles
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {['{nom}', '{montant}', '{bien}', '{date}', '{lien}', '{jours}'].map((v) => (
            <span key={v} className="bg-blue-100 text-blue-700 text-xs font-mono px-2 py-1 rounded-lg">
              {v}
            </span>
          ))}
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Ces variables seront automatiquement remplacées par les vraies valeurs lors de l&apos;envoi.
        </p>
      </div>

      <NotificationTemplatesForm templates={templates} />
    </div>
  )
}