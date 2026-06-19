import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { propertySchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const properties = await prisma.property.findMany({
      where: { userId: session.user.id },
      include: {
        tenants: true,
        contracts: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('[PROPERTIES_GET]', error)
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

    const parsed = propertySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    // Si gestionnaire et ownerId fourni, vérifie que le propriétaire lui appartient
    if (body.ownerId && session.user.role === 'MANAGER') {
      const owner = await prisma.owner.findFirst({
        where: {
          id: body.ownerId,
          managerId: session.user.id,
        },
      })
      if (!owner) {
        return NextResponse.json({ error: 'Propriétaire introuvable' }, { status: 404 })
      }
    }

    const property = await prisma.property.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
        ownerId: body.ownerId || null,
      },
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('[PROPERTIES_POST]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}