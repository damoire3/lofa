import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const FROM_SMS = process.env.TWILIO_PHONE_NUMBER!
const FROM_WHATSAPP = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`

// ─── SMS ──────────────────────────────────────────────────────────
export async function sendSMS({
  to,
  message,
}: {
  to: string
  message: string
}) {
  try {
    await client.messages.create({
      body: message,
      from: FROM_SMS,
      to,
    })
    console.log(`[TWILIO SMS] Envoyé à ${to}`)
  } catch (error) {
    console.error('[TWILIO SMS] Erreur:', error)
    throw error
  }
}

// ─── WhatsApp ─────────────────────────────────────────────────────
export async function sendWhatsApp({
  to,
  message,
}: {
  to: string
  message: string
}) {
  try {
    await client.messages.create({
      body: message,
      from: FROM_WHATSAPP,
      to: `whatsapp:${to}`,
    })
    console.log(`[TWILIO WHATSAPP] Envoyé à ${to}`)
  } catch (error) {
    console.error('[TWILIO WHATSAPP] Erreur:', error)
    throw error
  }
}

// ─── Rappel loyer (SMS + WhatsApp) ────────────────────────────────
export async function sendReminderNotification({
  phone,
  tenantName,
  amount,
  dueDate,
  portalUrl,
  daysUntilDue,
  customMessage,
}: {
  phone: string
  tenantName: string
  amount: number
  dueDate: string
  portalUrl: string
  daysUntilDue: number
  customMessage?: string
}) {
  const amountFormatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
  }).format(amount) + ' FCFA'

  const isLate = daysUntilDue < 0
  const isToday = daysUntilDue === 0

  const urgenceText = isLate
    ? `⚠️ RETARD de ${Math.abs(daysUntilDue)} jour(s)`
    : isToday
    ? `📅 Loyer dû AUJOURD'HUI`
    : `🔔 Rappel : loyer dans ${daysUntilDue} jour(s)`

  const defaultMessage = `${urgenceText}

Bonjour ${tenantName},

Votre loyer de ${amountFormatted} est ${
    isLate ? `en retard depuis le ${dueDate}.`
    : isToday ? `dû aujourd'hui (${dueDate}).`
    : `dû le ${dueDate}.`
  }

Consultez votre portail locataire :
${portalUrl}

— Lofa`

  const message = customMessage || defaultMessage

  // Envoie SMS et WhatsApp en parallèle
  const promises = []

  if (process.env.TWILIO_PHONE_NUMBER) {
    promises.push(sendSMS({ to: phone, message }))
  }

  if (process.env.TWILIO_WHATSAPP_NUMBER) {
    promises.push(sendWhatsApp({ to: phone, message }))
  }

  await Promise.allSettled(promises) // allSettled = on continue même si l'un échoue
}

// ─── Confirmation paiement ────────────────────────────────────────
export async function sendPaymentConfirmationSMS({
  phone,
  tenantName,
  amount,
  propertyName,
  portalUrl,
  customMessage,
}: {
  phone: string
  tenantName: string
  amount: number
  propertyName: string
  portalUrl: string
  customMessage?: string
}) {
  const amountFormatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
  }).format(amount) + ' FCFA'

  const defaultMessage = `✅ Paiement confirmé !

Bonjour ${tenantName},

Votre paiement de ${amountFormatted} pour ${propertyName} a été reçu.

Téléchargez votre quittance :
${portalUrl}

— Lofa`

  const message = customMessage || defaultMessage

  const promises = []

  if (process.env.TWILIO_PHONE_NUMBER) {
    promises.push(sendSMS({ to: phone, message }))
  }

  if (process.env.TWILIO_WHATSAPP_NUMBER) {
    promises.push(sendWhatsApp({ to: phone, message }))
  }

  await Promise.allSettled(promises)
}