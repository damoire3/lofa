import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { IconArrowLeft, IconFileText, IconClock } from '@tabler/icons-react'

export default async function TenantDocumentsPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const tenant = await prisma.tenant.findUnique({
    where: { token },
    select: { id: true, firstName: true, lastName: true },
  })

  if (!tenant) notFound()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-8 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-500/15 blur-[140px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-lg mx-auto">
          <Link
            href={`/portal/${token}`}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-4"
          >
            <IconArrowLeft size={16} />
            Retour au portail
          </Link>
          <h1 className="text-xl font-bold">Documents</h1>
          <p className="text-gray-400 text-sm mt-1">
            {tenant.firstName} {tenant.lastName}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 120" className="w-full h-[60px]" preserveAspectRatio="none">
            <path
              fill="#f9fafb"
              d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,74.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-lg mx-auto px-4 py-6 flex-1 w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconClock size={24} className="text-amber-500" />
          </div>
          <h2 className="font-semibold text-gray-900 mb-2">
            Bientôt disponible
          </h2>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            L&apos;espace documents (bail, pièce d&apos;identité, état des lieux) sera bientôt accessible ici. Vos quittances restent disponibles dans l&apos;onglet Paiements.
          </p>
          <Link
            href={`/portal/${token}/payments`}
            className="inline-flex items-center gap-2 mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <IconFileText size={16} />
            Voir mes quittances
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white px-4 pt-16 pb-8">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg viewBox="0 0 1440 120" className="w-full h-[60px]" preserveAspectRatio="none">
            <path
              fill="#f9fafb"
              d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,74.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
        <div className="relative z-10 text-center">
          <a href="/" className="text-lg font-bold tracking-tight text-white">
            lo<span className="text-green-400">fa</span>
          </a>
          <p className="text-gray-500 text-xs mt-2">Gestion immobilière simplifiée</p>
        </div>
      </div>
    </div>
  )
}