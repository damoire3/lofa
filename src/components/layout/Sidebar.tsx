'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  IconHome,
  IconBuildingSkyscraper,
  IconUsers,
  IconFileText,
  IconCreditCard,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconUserCircle,
  IconX,
} from '@tabler/icons-react'
import type { SessionUser } from '@/types'
import { IconBell } from '@tabler/icons-react'


const navItems = [
  { href: '/dashboard', icon: IconHome, label: 'Tableau de bord' },
  { href: '/dashboard/properties', icon: IconBuildingSkyscraper, label: 'Biens' },
  { href: '/dashboard/tenants', icon: IconUsers, label: 'Locataires' },
  { href: '/dashboard/contracts', icon: IconFileText, label: 'Contrats' },
  { href: '/dashboard/payments', icon: IconCreditCard, label: 'Paiements' },
  { href: '/dashboard/reports', icon: IconChartBar, label: 'Rapports' },
  { href: '/dashboard/settings', icon: IconSettings, label: 'Paramètres' },
  { href: '/dashboard/settings/notifications', icon: IconBell, label: 'Notifications' },
]

const managerItems = [
  { href: '/dashboard/owners', icon: IconUserCircle, label: 'Propriétaires' },
]

function SidebarContent({
  user,
  onClose,
}: {
  user: SessionUser
  onClose?: () => void
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          lo<span className="text-green-400">fa</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors md:hidden"
          >
            <IconX size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}

        {user.role === 'MANAGER' && (
          <>
            <div className="pt-4 pb-2 px-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Gestion
              </p>
            </div>
            {managerItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User & Logout */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.plan}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <IconLogout size={18} />
          Se déconnecter
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({
  user,
  isOpen,
  onClose,
}: {
  user: SessionUser
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar mobile */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-50 transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent user={user} onClose={onClose} />
      </aside>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex-col">
        <SidebarContent user={user} />
      </aside>
    </>
  )
}