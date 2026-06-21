import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Lofa <onboarding@resend.dev>',
      to: 'contact@lofa.app', // remplace par ton vrai email de réception
      replyTo: email,
      subject: `Nouveau message de ${name} — Lofa`,
      html: `
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong></p>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ message: 'Message envoyé' })
  } catch (error) {
    console.error('[CONTACT]', error)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi' }, { status: 500 })
  }
}