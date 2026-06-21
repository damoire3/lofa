import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendReminderEmail } from '@/lib/resend'
import { buildTenantPortalUrl } from '@/lib/tokens'
import { formatCurrency, formatDate } from '@/lib/utils'
import { REMINDER_SCHEDULE } from '@/constants'

export async function POST(req: Request) {
  try {
    // Vérifie la clé secrète pour sécuriser l'endpoint
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Récupère tous les paiements actifs
const payments = await prisma.payment.findMany({
  where: {
    status: { in: ['PENDING', 'PARTIAL', 'LATE'] },
  },
  include: {
    tenant: true,
    contract: {
      include: { property: true },
    },
  },
})

    let remindersSent = 0

    for (const payment of payments) {
      const dueDate = new Date(payment.dueDate)
      dueDate.setHours(0, 0, 0, 0)

      const diffTime = dueDate.getTime() - today.getTime()
      const daysUntilDue = Math.round(diffTime / (1000 * 60 * 60 * 24))

      // Vérifie si c'est un jour de rappel
      const allReminderDays = [
        ...REMINDER_SCHEDULE.BEFORE,
        ...REMINDER_SCHEDULE.AFTER,
      ]

      if (!allReminderDays.includes(daysUntilDue as -7 | -3 | 0 | 1 | 3 | 7)) {
        continue
      }

      const tenant = payment.tenant
      if (!tenant.email) continue

      const portalUrl = buildTenantPortalUrl(tenant.token)

      await sendReminderEmail({
        to: tenant.email,
        tenantName: `${tenant.firstName} ${tenant.lastName}`,
        amount: payment.expectedAmount,
        dueDate: formatDate(payment.dueDate),
        portalUrl,
        daysUntilDue,
      })

      // Marque le paiement en retard si dépassé
      if (daysUntilDue < 0 && payment.status === 'PENDING') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'LATE' },
        })
      }

      remindersSent++
    }

    return NextResponse.json({
      message: `${remindersSent} rappel(s) envoyé(s)`,
      remindersSent,
    })
  } catch (error) {
    console.error('[REMINDERS]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}