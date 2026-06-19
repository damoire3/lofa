import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { propertySchema } from '@/lib/validations'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params

    const property = await prisma.property.findFirst({
      where: { id, userId: session.user.id },
      include: { tenants: true, contracts: true },
    })

    if (!property) {
      return NextResponse.json({ error: 'Bien introuvable' }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('[PROPERTY_GET]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const property = await prisma.property.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!property) {
      return NextResponse.json({ error: 'Bien introuvable' }, { status: 404 })
    }

    // Cas spécial : rattachement/détachement d'un propriétaire uniquement
    if (body.ownerId !== undefined && Object.keys(body).length === 1) {
      if (body.ownerId && session.user.role === 'MANAGER') {
        const owner = await prisma.owner.findFirst({
          where: { id: body.ownerId, managerId: session.user.id },
        })
        if (!owner) {
          return NextResponse.json({ error: 'Propriétaire introuvable' }, { status: 404 })
        }
      }

      const updated = await prisma.property.update({
        where: { id },
        data: { ownerId: body.ownerId || null },
      })

      return NextResponse.json(updated)
    }

    const parsed = propertySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const updated = await prisma.property.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[PROPERTY_PATCH]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params

    const property = await prisma.property.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!property) {
      return NextResponse.json({ error: 'Bien introuvable' }, { status: 404 })
    }

    await prisma.property.delete({ where: { id } })

    return NextResponse.json({ message: 'Bien supprimé' })
  } catch (error) {
    console.error('[PROPERTY_DELETE]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}