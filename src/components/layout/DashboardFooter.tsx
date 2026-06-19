import Link from 'next/link'
import { APP_NAME } from '@/constants'

export default function DashboardFooter() {
  return (
    <footer className="md:hidden border-t border-white/10 bg-gray-900 mt-8 py-4 px-4 w-full">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <p>© {new Date().getFullYear()} {APP_NAME}</p>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings" className="hover:text-green-400 transition-colors">
            Paramètres
          </Link>
          <Link href="/api/auth/signout" className="hover:text-red-400 transition-colors">
            Déconnexion
          </Link>
        </div>
      </div>
    </footer>
  )
}