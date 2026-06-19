import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Lofa <noreply@lofa.app>'

// ─── Rappel de loyer ──────────────────────────────────────────────
export async function sendReminderEmail({
  to,
  tenantName,
  amount,
  dueDate,
  portalUrl,
  daysUntilDue,
}: {
  to: string
  tenantName: string
  amount: number
  dueDate: string
  portalUrl: string
  daysUntilDue: number
}) {
  const isLate = daysUntilDue < 0
  const isToday = daysUntilDue === 0

  const subject = isLate
    ? `⚠️ Loyer en retard — ${Math.abs(daysUntilDue)} jour(s) de retard`
    : isToday
    ? `📅 Votre loyer est dû aujourd'hui`
    : `🔔 Rappel — Votre loyer est dû dans ${daysUntilDue} jour(s)`

  const urgencyColor = isLate ? '#ef4444' : isToday ? '#f59e0b' : '#16a34a'
  const urgencyText = isLate
    ? `Votre loyer est en retard de ${Math.abs(daysUntilDue)} jour(s).`
    : isToday
    ? `Votre loyer est dû aujourd'hui.`
    : `Votre loyer est dû dans ${daysUntilDue} jour(s).`

  const amountFormatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
  }).format(amount) + ' FCFA'

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 0;">
      <div style="max-width: 500px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background: #111827; padding: 24px 32px;">
          <span style="font-size: 24px; font-weight: 800; color: white;">lo</span>
          <span style="font-size: 24px; font-weight: 800; color: #4ade80;">fa</span>
          <div style="height: 3px; background: #16a34a; margin-top: 16px; border-radius: 99px;"></div>
        </div>

        <!-- Corps -->
        <div style="padding: 32px;">
          <p style="color: #374151; font-size: 15px; margin-bottom: 8px;">
            Bonjour <strong>${tenantName}</strong>,
          </p>

          <div style="background: ${urgencyColor}15; border: 1px solid ${urgencyColor}30; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="color: ${urgencyColor}; font-weight: 600; margin: 0 0 4px;">
              ${urgencyText}
            </p>
            <p style="color: #374151; font-size: 22px; font-weight: 800; margin: 8px 0 0;">
              ${amountFormatted}
            </p>
            <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0;">
              Échéance : ${dueDate}
            </p>
          </div>

          <a href="${portalUrl}"
            style="display: block; text-align: center; background: #16a34a; color: white; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px; margin-top: 24px;">
            Voir mon portail locataire
          </a>

          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
            Ce message est envoyé automatiquement par Lofa.<br>
            Ne répondez pas à cet email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #111827; padding: 16px 32px; text-align: center;">
          <span style="color: white; font-weight: 800;">lo</span>
          <span style="color: #4ade80; font-weight: 800;">fa</span>
          <p style="color: #6b7280; font-size: 11px; margin: 6px 0 0;">
            Gestion immobilière simplifiée · lofa.app
          </p>
        </div>

      </div>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    })
    console.log(`[RESEND] Rappel envoyé à ${to}`)
  } catch (error) {
    console.error('[RESEND] Erreur rappel:', error)
    throw error
  }
}

// ─── Confirmation de paiement ─────────────────────────────────────
export async function sendPaymentConfirmationEmail({
  to,
  tenantName,
  amount,
  propertyName,
  portalUrl,
}: {
  to: string
  tenantName: string
  amount: number
  propertyName: string
  portalUrl: string
}) {
  const amountFormatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
  }).format(amount) + ' FCFA'

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 0;">
      <div style="max-width: 500px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background: #111827; padding: 24px 32px;">
          <span style="font-size: 24px; font-weight: 800; color: white;">lo</span>
          <span style="font-size: 24px; font-weight: 800; color: #4ade80;">fa</span>
          <div style="height: 3px; background: #16a34a; margin-top: 16px; border-radius: 99px;"></div>
        </div>

        <!-- Corps -->
        <div style="padding: 32px;">
          <p style="color: #374151; font-size: 15px; margin-bottom: 8px;">
            Bonjour <strong>${tenantName}</strong>,
          </p>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">✅</div>
            <p style="color: #16a34a; font-weight: 700; font-size: 16px; margin: 0 0 4px;">
              Paiement confirmé
            </p>
            <p style="color: #374151; font-size: 24px; font-weight: 800; margin: 8px 0 4px;">
              ${amountFormatted}
            </p>
            <p style="color: #6b7280; font-size: 13px; margin: 0;">
              ${propertyName}
            </p>
          </div>

          <a href="${portalUrl}"
            style="display: block; text-align: center; background: #16a34a; color: white; padding: 14px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px; margin-top: 24px;">
            Télécharger ma quittance
          </a>

          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
            Ce message est envoyé automatiquement par Lofa.<br>
            Ne répondez pas à cet email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #111827; padding: 16px 32px; text-align: center;">
          <span style="color: white; font-weight: 800;">lo</span>
          <span style="color: #4ade80; font-weight: 800;">fa</span>
          <p style="color: #6b7280; font-size: 11px; margin: 6px 0 0;">
            Gestion immobilière simplifiée · lofa.app
          </p>
        </div>

      </div>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `✅ Paiement confirmé — ${amountFormatted} pour ${propertyName}`,
      html,
    })
    console.log(`[RESEND] Confirmation envoyée à ${to}`)
  } catch (error) {
    console.error('[RESEND] Erreur confirmation:', error)
    throw error
  }
}