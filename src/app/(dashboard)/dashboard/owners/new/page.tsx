import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import OwnerForm from '@/components/forms/OwnerForm'

export default async function NewOwnerPage() {
  const session = await auth()
  if (!session) return null

  if (session.user.role !== 'MANAGER') {
    redirect('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/owners"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-4"
        >
          <IconArrowLeft size={16} />
          Retour aux propriétaires
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Ajouter un propriétaire
        </h1>
        <p className="text-gray-500 mt-1">
          Créez le profil du propriétaire dont vous gérez les biens
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <OwnerForm />
      </div>
    </div>
  )
}