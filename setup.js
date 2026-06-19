import fs from 'fs'
import path from 'path'

const base = path.join(__dirname, 'src')

const structure = [
  // Marketing (landing page)
  'app/(marketing)/page.tsx',
  'app/(marketing)/layout.tsx',

  // Auth
  'app/(auth)/login/page.tsx',
  'app/(auth)/register/page.tsx',
  'app/(auth)/layout.tsx',

  // Dashboard propriétaire & gestionnaire
  'app/(dashboard)/layout.tsx',
  'app/(dashboard)/dashboard/page.tsx',
  'app/(dashboard)/properties/page.tsx',
  'app/(dashboard)/properties/[id]/page.tsx',
  'app/(dashboard)/properties/new/page.tsx',
  'app/(dashboard)/tenants/page.tsx',
  'app/(dashboard)/tenants/[id]/page.tsx',
  'app/(dashboard)/tenants/new/page.tsx',
  'app/(dashboard)/contracts/page.tsx',
  'app/(dashboard)/contracts/[id]/page.tsx',
  'app/(dashboard)/contracts/new/page.tsx',
  'app/(dashboard)/payments/page.tsx',
  'app/(dashboard)/payments/[id]/page.tsx',
  'app/(dashboard)/owners/page.tsx',
  'app/(dashboard)/owners/[id]/page.tsx',
  'app/(dashboard)/owners/new/page.tsx',
  'app/(dashboard)/reports/page.tsx',
  'app/(dashboard)/settings/page.tsx',

  // Portail locataire (token)
  'app/(tenant-portal)/portal/[token]/page.tsx',
  'app/(tenant-portal)/portal/[token]/payments/page.tsx',
  'app/(tenant-portal)/portal/[token]/documents/page.tsx',
  'app/(tenant-portal)/layout.tsx',

  // Portail suivi propriétaire (lien lecture seule)
  'app/(owner-portal)/owner/[token]/page.tsx',
  'app/(owner-portal)/layout.tsx',

  // API routes
  'app/api/auth/[...nextauth]/route.ts',
  'app/api/properties/route.ts',
  'app/api/properties/[id]/route.ts',
  'app/api/tenants/route.ts',
  'app/api/tenants/[id]/route.ts',
  'app/api/contracts/route.ts',
  'app/api/contracts/[id]/route.ts',
  'app/api/payments/route.ts',
  'app/api/payments/[id]/route.ts',
  'app/api/payments/initiate/route.ts',
  'app/api/payments/webhook/route.ts',
  'app/api/owners/route.ts',
  'app/api/owners/[id]/route.ts',
  'app/api/reminders/route.ts',
  'app/api/reports/route.ts',

  // Composants UI (shadcn)
  'components/ui/button.tsx',
  'components/ui/input.tsx',
  'components/ui/label.tsx',
  'components/ui/dialog.tsx',
  'components/ui/toast.tsx',
  'components/ui/select.tsx',
  'components/ui/badge.tsx',
  'components/ui/card.tsx',
  'components/ui/table.tsx',
  'components/ui/avatar.tsx',
  'components/ui/dropdown-menu.tsx',

  // Layout
  'components/layout/Navbar.tsx',
  'components/layout/Sidebar.tsx',
  'components/layout/Footer.tsx',
  'components/layout/MobileMenu.tsx',

  // Dashboard
  'components/dashboard/PropertyCard.tsx',
  'components/dashboard/TenantCard.tsx',
  'components/dashboard/PaymentTable.tsx',
  'components/dashboard/ContractCard.tsx',
  'components/dashboard/OwnerCard.tsx',
  'components/dashboard/StatsCard.tsx',
  'components/dashboard/RecentActivity.tsx',

  // Formulaires
  'components/forms/LoginForm.tsx',
  'components/forms/RegisterForm.tsx',
  'components/forms/PropertyForm.tsx',
  'components/forms/TenantForm.tsx',
  'components/forms/ContractForm.tsx',
  'components/forms/PaymentForm.tsx',
  'components/forms/OwnerForm.tsx',

  // Portail locataire
  'components/portal/PortalHeader.tsx',
  'components/portal/PaymentHistory.tsx',
  'components/portal/DocumentList.tsx',
  'components/portal/BalanceSummary.tsx',

  // Portail propriétaire
  'components/owner/OwnerHeader.tsx',
  'components/owner/OwnerStats.tsx',
  'components/owner/OwnerReports.tsx',

  // Landing page
  'components/marketing/Hero.tsx',
  'components/marketing/Pricing.tsx',
  'components/marketing/Features.tsx',
  'components/marketing/Testimonials.tsx',
  'components/marketing/CTA.tsx',

  // Lib
  'lib/prisma.ts',
  'lib/auth.ts',
  'lib/utils.ts',
  'lib/flutterwave.ts',
  'lib/resend.ts',
  'lib/tokens.ts',
  'lib/reminders.ts',
  'lib/validations.ts',

  // Hooks
  'hooks/useSession.ts',
  'hooks/useProperties.ts',
  'hooks/useTenants.ts',
  'hooks/usePayments.ts',
  'hooks/useContracts.ts',

  // Types
  'types/index.ts',
  'types/property.ts',
  'types/tenant.ts',
  'types/payment.ts',
  'types/contract.ts',
  'types/owner.ts',

  // Constants
  'constants/index.ts',
  'constants/plans.ts',
]

// Fichiers hors src/
const rootFiles = [
  '.env.example',
]

function createFile(filePath) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '')
    console.log(`✅ créé : ${filePath.replace(__dirname + path.sep, '')}`)
  } else {
    console.log(`⏭️  existe déjà : ${filePath.replace(__dirname + path.sep, '')}`)
  }
}

structure.forEach(f => createFile(path.join(base, f)))
rootFiles.forEach(f => createFile(path.join(__dirname, f)))

console.log('\n🎉 Structure Lofa créée avec succès !')