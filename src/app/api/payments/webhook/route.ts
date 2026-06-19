import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPaymentConfirmationEmail } from '@/lib/resend'
import { buildTenantPortalUrl } from '@/lib/tokens'
import { sendPaymentConfirmationSMS } from '@/lib/twilio'

// Flutterwave envoie un hash SHA256 pour vérifier l'authenticité
// On compare avec notre FLUTTERWAVE_SECRET_HASH
function verifyWebhookSignature(
  signature: string | null,
  secretHash: string
): boolean {
  if (!signature) return false
  return signature === secretHash
}

export async function POST(req: Request) {
  try {
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH

    if (!secretHash) {
      console.error('[WEBHOOK] FLUTTERWAVE_SECRET_HASH non configuré')
      return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
    }

    // Vérifie la signature dans le header
    const signature = req.headers.get('verif-hash')
    if (!verifyWebhookSignature(signature, secretHash)) {
      console.warn('[WEBHOOK] Signature invalide — requête rejetée')
      return NextResponse.json({ error: 'Signature invalide' }, { status: 401 })
    }

    const body = await req.json()

    // Flutterwave envoie différents types d'événements
    const { event, data } = body

    // On ne traite que les paiements réussis
    if (event !== 'charge.completed') {
      return NextResponse.json({ message: 'Événement ignoré' })
    }

    if (data.status !== 'successful') {
      return NextResponse.json({ message: 'Paiement non réussi — ignoré' })
    }

    // On récupère le meta.paymentId qu'on aura passé lors de l'initiation
    const paymentId = data.meta?.paymentId

    if (!paymentId) {
      console.error('[WEBHOOK] paymentId manquant dans meta')
      return NextResponse.json({ error: 'paymentId manquant' }, { status: 400 })
    }

    // Met à jour le paiement en base
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        tenant: true,
        contract: { include: { property: true } },
      },
    })

    if (!payment) {
      console.error(`[WEBHOOK] Paiement ${paymentId} introuvable`)
      return NextResponse.json({ error: 'Paiement introuvable' }, { status: 404 })
    }

    // Évite de traiter deux fois le même paiement
    if (payment.status === 'PAID') {
      return NextResponse.json({ message: 'Paiement déjà validé' })
    }

    const isPaid = data.amount >= payment.expectedAmount
    const isPartial = data.amount < payment.expectedAmount

await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: isPaid ? 'PAID' : isPartial ? 'PARTIAL' : 'PENDING',
        amount: data.amount,
        paidAt: new Date(),
      },
    })

    // Envoie email de confirmation si le locataire a un email
    if (payment.tenant.email && isPaid) {
      try {
        await sendPaymentConfirmationEmail({
          to: payment.tenant.email,
          tenantName: `${payment.tenant.firstName} ${payment.tenant.lastName}`,
          amount: data.amount,
          propertyName: payment.contract.property.name,
          portalUrl: buildTenantPortalUrl(payment.tenant.token),
        })
      } catch (emailError) {
        // On ne bloque pas si l'email échoue
        console.error('[WEBHOOK] Erreur email confirmation:', emailError)
      }
    }

    try {
  await sendPaymentConfirmationSMS({
    phone: payment.tenant.phone,
    tenantName: `${payment.tenant.firstName} ${payment.tenant.lastName}`,
    amount: data.amount,
    propertyName: payment.contract.property.name,
    portalUrl: buildTenantPortalUrl(payment.tenant.token),
  })
} catch (smsError) {
  console.error('[WEBHOOK] Erreur SMS confirmation:', smsError)
}

    console.log(`[WEBHOOK] Paiement ${paymentId} mis à jour → ${isPaid ? 'PAID' : 'PARTIAL'}`)
    return NextResponse.json({ message: 'Paiement mis à jour avec succès' })

    console.log(`[WEBHOOK] Paiement ${paymentId} mis à jour → ${isPaid ? 'PAID' : 'PARTIAL'}`)

    return NextResponse.json({ message: 'Paiement mis à jour avec succès' })
  } catch (error) {
    console.error('[WEBHOOK]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}