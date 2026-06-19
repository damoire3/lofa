import { prisma } from '@/lib/prisma'
import { sendReminderEmail, sendPaymentConfirmationEmail } from '@/lib/resend'
import { sendReminderNotification, sendPaymentConfirmationSMS } from '@/lib/twilio'
import { buildTenantPortalUrl } from '@/lib/tokens'

// Variables disponibles dans les templates
const DEFAULT_TEMPLATES = {
  REMINDER_BEFORE: {
    EMAIL: {
      subject: 'Rappel — Votre loyer est dû dans {jours} jour(s)',
      body: 'Bonjour {nom},\n\nVotre loyer de {montant} pour {bien} est dû le {date}.\n\nConsultez votre portail : {lien}',
    },
    SMS: {
      body: '🔔 Bonjour {nom}, votre loyer de {montant} pour {bien} est dû le {date}. Portail : {lien}',
    },
    WHATSAPP: {
      body: '🔔 Bonjour {nom}, votre loyer de {montant} pour {bien} est dû le {date}. Portail : {lien}',
    },
  },
  REMINDER_LATE: {
    EMAIL: {
      subject: '⚠️ Loyer en retard — {jours} jour(s) de retard',
      body: 'Bonjour {nom},\n\nVotre loyer de {montant} pour {bien} est en retard de {jours} jour(s).\n\nConsultez votre portail : {lien}',
    },
    SMS: {
      body: '⚠️ Bonjour {nom}, votre loyer de {montant} pour {bien} est en retard de {jours} jour(s). Portail : {lien}',
    },
    WHATSAPP: {
      body: '⚠️ Bonjour {nom}, votre loyer de {montant} pour {bien} est en retard de {jours} jour(s). Portail : {lien}',
    },
  },
  PAYMENT_CONFIRMATION: {
    EMAIL: {
      subject: '✅ Paiement confirmé — {montant} pour {bien}',
      body: 'Bonjour {nom},\n\nVotre paiement de {montant} pour {bien} a été reçu.\n\nTéléchargez votre quittance : {lien}',
    },
    SMS: {
      body: '✅ Bonjour {nom}, votre paiement de {montant} pour {bien} a été confirmé. Quittance : {lien}',
    },
    WHATSAPP: {
      body: '✅ Bonjour {nom}, votre paiement de {montant} pour {bien} a été confirmé. Quittance : {lien}',
    },
  },
}

function interpolate(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(
    /\{(\w+)\}/g,
    (_, key) => variables[key] || `{${key}}`
  )
}

async function getTemplate(
  userId: string,
  type: string,
  channel: string
): Promise<{ subject?: string; body: string }> {
  const custom = await prisma.notificationTemplate.findUnique({
    where: {
      userId_type_channel: { userId, type, channel },
    },
  })

  if (custom) {
    return { subject: custom.subject || undefined, body: custom.body }
  }

  // Fallback vers le template par défaut
  const defaults = DEFAULT_TEMPLATES[type as keyof typeof DEFAULT_TEMPLATES]
  const channelDefaults = defaults?.[channel as keyof typeof defaults] as { subject?: string; body: string }
  return channelDefaults || { body: '' }
}

export async function sendReminderNotifications({
  userId,
  tenantId,
  paymentId,
  daysUntilDue,
}: {
  userId: string
  tenantId: string
  paymentId: string
  daysUntilDue: number
}) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      contracts: {
        where: { status: 'ACTIVE' },
        include: { property: true },
        take: 1,
      },
    },
  })

  if (!tenant) return

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  })

  if (!payment) return

  const property = tenant.contracts[0]?.property
  const portalUrl = buildTenantPortalUrl(tenant.token)

  const amountFormatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
  }).format(payment.expectedAmount) + ' FCFA'

  const dueDateFormatted = new Date(payment.dueDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const variables: Record<string, string> = {
    nom: `${tenant.firstName} ${tenant.lastName}`,
    montant: amountFormatted,
    bien: property?.name || 'votre bien',
    date: dueDateFormatted,
    lien: portalUrl,
    jours: String(Math.abs(daysUntilDue)),
  }

  const templateType = daysUntilDue < 0 ? 'REMINDER_LATE' : 'REMINDER_BEFORE'

  // Email
  if (tenant.email) {
    const template = await getTemplate(userId, templateType, 'EMAIL')
    if (template.body) {
      try {
        await sendReminderEmail({
          to: tenant.email,
          tenantName: variables.nom,
          amount: payment.expectedAmount,
          dueDate: dueDateFormatted,
          portalUrl,
          daysUntilDue,
          customSubject: template.subject ? interpolate(template.subject, variables) : undefined,
          customBody: interpolate(template.body, variables),
        })
      } catch (error) {
        console.error('[NOTIF] Erreur email:', error)
      }
    }
  }

  // SMS
  const smsTemplate = await getTemplate(userId, templateType, 'SMS')
  if (smsTemplate.body && tenant.phone) {
    try {
      await sendReminderNotification({
        phone: tenant.phone,
        tenantName: variables.nom,
        amount: payment.expectedAmount,
        dueDate: dueDateFormatted,
        portalUrl,
        daysUntilDue,
        customMessage: interpolate(smsTemplate.body, variables),
      })
    } catch (error) {
      console.error('[NOTIF] Erreur SMS:', error)
    }
  }
}