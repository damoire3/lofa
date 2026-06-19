'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import DashboardHeader from '@/components/layout/DashboardHeader'
import DashboardFooter from '@/components/layout/DashboardFooter'
import AutoLogout from '@/components/layout/AutoLogout'
import type { SessionUser } from '@/types'

export default function DashboardShell({
  user,
  children,
}: {
  user: SessionUser
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <AutoLogout />
      <Sidebar user={user} isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <main className="md:ml-64 min-h-screen flex flex-col">
        <DashboardHeader onMenuClick={() => setIsOpen(true)} />

        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>

        <DashboardFooter />
      </main>
    </div>
  )
}