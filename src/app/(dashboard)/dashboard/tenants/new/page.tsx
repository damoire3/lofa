import { auth } from '@/lib/auth'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import TenantForm from '@/components/forms/TenantForm'

export default async function NewTenantPage() {
  const session = await auth()
  if (!session) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/tenants"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm mb-4"
        >
          <IconArrowLeft size={16} />
          Retour aux locataires
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Ajouter un locataire</h1>
        <p className="text-gray-500 mt-1">
          Renseignez les informations personnelles du locataire
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <TenantForm />
      </div>
    </div>
  )
}