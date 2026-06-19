'use client'

import { usePathname } from 'next/navigation'
import { IconMenu2 } from '@tabler/icons-react'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/dashboard/properties': 'Biens',
  '/dashboard/tenants': 'Locataires',
  '/dashboard/contracts': 'Contrats',
  '/dashboard/payments': 'Paiements',
  '/dashboard/owners': 'Propriétaires',
  '/dashboard/reports': 'Rapports',
  '/dashboard/settings': 'Paramètres',
}

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]

  for (const [path, title] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(path) && path !== '/dashboard') {
      return title
    }
  }

  return 'Lofa'
}

export default function DashboardHeader({
  onMenuClick,
}: {
  onMenuClick: () => void
}) {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
<header className="md:hidden sticky top-0 z-30 bg-gray-900 border-b border-white/10 px-4 py-3 flex items-center justify-between">
  <span className="text-lg font-bold tracking-tight text-white">
    lo<span className="text-green-400">fa</span>
  </span>

  <h1 className="text-sm font-semibold text-gray-300">{title}</h1>

  <button
    onClick={onMenuClick}
    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-green-400 transition-colors"
    aria-label="Ouvrir le menu"
  >
    <IconMenu2 size={20} />
  </button>
</header>
  )
}