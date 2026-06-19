import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/layout/DashboardShell'
import type { Role, Plan } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const user = {
    id: session.user.id ?? '',
    name: session.user.name ?? '',
    email: session.user.email ?? '',
    role: session.user.role as Role,
    plan: session.user.plan as Plan,
  }

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  )
}