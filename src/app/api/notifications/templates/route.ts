import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const templates = await prisma.notificationTemplate.findMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('[TEMPLATES_GET]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { type, channel, subject, body: templateBody } = body

    if (!type || !channel || !templateBody) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    const template = await prisma.notificationTemplate.upsert({
      where: {
        userId_type_channel: {
          userId: session.user.id,
          type,
          channel,
        },
      },
      update: {
        subject: subject || null,
        body: templateBody,
      },
      create: {
        userId: session.user.id,
        type,
        channel,
        subject: subject || null,
        body: templateBody,
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('[TEMPLATES_POST]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}