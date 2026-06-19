import { prisma } from '@/lib/prisma'
import { sendReminderEmail } from '@/lib/resend'
import { sendReminderNotification } from '@/lib/twilio'
import { buildTenantPortalUrl } from '@/lib/tokens'
import { formatDate } from '@/lib/utils'

const REMINDER_DAYS_BEFORE = [-7, -3, 0]
const REMINDER_DAYS_AFTER = [1, 3, 7]
const ALL_REMINDER_DAYS = [...REMINDER_DAYS_BEFORE, ...REMINDER_DAYS_AFTER]

export async function processReminders() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const payments = await prisma.payment.findMany({
    where: {
      status: { in: ['PENDING', 'PARTIAL', 'LATE'] },
    },
    include: {
      tenant: true,
      contract: { include: { property: true } },
    },
  })

  let remindersSent = 0
  let paymentsMarkedLate = 0

  for (const payment of payments) {
    const dueDate = new Date(payment.dueDate)
    dueDate.setHours(0, 0, 0, 0)

    const diffTime = dueDate.getTime() - today.getTime()
    const daysUntilDue = Math.round(diffTime / (1000 * 60 * 60 * 24))

    // Marque automatiquement en retard
    if (daysUntilDue < 0 && payment.status === 'PENDING') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'LATE' },
      })
      paymentsMarkedLate++
    }

    // Vérifie si c'est un jour de rappel
    if (!ALL_REMINDER_DAYS.includes(daysUntilDue)) continue

    const tenant = payment.tenant
    const portalUrl = buildTenantPortalUrl(tenant.token)
    const dueDateFormatted = formatDate(payment.dueDate)

    // Email (si email disponible)
    if (tenant.email) {
      try {
        await sendReminderEmail({
          to: tenant.email,
          tenantName: `${tenant.firstName} ${tenant.lastName}`,
          amount: payment.expectedAmount,
          dueDate: dueDateFormatted,
          portalUrl,
          daysUntilDue,
        })
        remindersSent++
      } catch (error) {
        console.error(`[REMINDERS] Erreur email ${tenant.email}:`, error)
      }
    }

    // SMS + WhatsApp (toujours, car tout le monde a un téléphone)
    try {
      await sendReminderNotification({
        phone: tenant.phone,
        tenantName: `${tenant.firstName} ${tenant.lastName}`,
        amount: payment.expectedAmount,
        dueDate: dueDateFormatted,
        portalUrl,
        daysUntilDue,
      })
      remindersSent++
    } catch (error) {
      console.error(`[REMINDERS] Erreur SMS ${tenant.phone}:`, error)
    }
  }

  return { remindersSent, paymentsMarkedLate }
}