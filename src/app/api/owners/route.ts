import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { ownerSchema } from '@/lib/validations'
import { generateToken } from '@/lib/tokens'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    if (session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const owners = await prisma.owner.findMany({
      where: { managerId: session.user.id },
      include: { properties: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(owners)
  } catch (error) {
    console.error('[OWNERS_GET]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    if (session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await req.json()

    const parsed = ownerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    // Génère le token unique pour le portail suivi
    const token = generateToken()

    const owner = await prisma.owner.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        token,
        managerId: session.user.id,
      },
    })

    return NextResponse.json(owner, { status: 201 })
  } catch (error) {
    console.error('[OWNERS_POST]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}