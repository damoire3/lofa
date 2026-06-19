import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { ownerSchema } from '@/lib/validations'
import { generateToken } from '@/lib/tokens'

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

    const owner = await prisma.owner.findFirst({
      where: { id, managerId: session.user.id },
      include: { properties: { include: { tenants: true } } },
    })

    if (!owner) {
      return NextResponse.json({ error: 'Propriétaire introuvable' }, { status: 404 })
    }

    return NextResponse.json(owner)
  } catch (error) {
    console.error('[OWNER_GET]', error)
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

    const owner = await prisma.owner.findFirst({
      where: { id, managerId: session.user.id },
    })

    if (!owner) {
      return NextResponse.json({ error: 'Propriétaire introuvable' }, { status: 404 })
    }

    // Si on demande une régénération du token
    if (body.regenerateToken) {
      const newToken = generateToken()
      const updated = await prisma.owner.update({
        where: { id },
        data: { token: newToken },
      })
      return NextResponse.json(updated)
    }

    const parsed = ownerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const updated = await prisma.owner.update({
      where: { id },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[OWNER_PATCH]', error)
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

    const owner = await prisma.owner.findFirst({
      where: { id, managerId: session.user.id },
    })

    if (!owner) {
      return NextResponse.json({ error: 'Propriétaire introuvable' }, { status: 404 })
    }

    await prisma.owner.delete({ where: { id } })

    return NextResponse.json({ message: 'Propriétaire supprimé' })
  } catch (error) {
    console.error('[OWNER_DELETE]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}