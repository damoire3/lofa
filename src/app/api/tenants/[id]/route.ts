import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { tenantSchema } from '@/lib/validations'

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

    const tenant = await prisma.tenant.findFirst({
      where: { id, userId: session.user.id },
      include: {
        property: true,
        contracts: true,
        payments: true,
      },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Locataire introuvable' }, { status: 404 })
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error('[TENANT_GET]', error)
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

    const parsed = tenantSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const tenant = await prisma.tenant.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Locataire introuvable' }, { status: 404 })
    }

    const updated = await prisma.tenant.update({
      where: { id },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        propertyId: parsed.data.propertyId,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[TENANT_PATCH]', error)
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

    const tenant = await prisma.tenant.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Locataire introuvable' }, { status: 404 })
    }

    await prisma.tenant.delete({ where: { id } })

    return NextResponse.json({ message: 'Locataire supprimé' })
  } catch (error) {
    console.error('[TENANT_DELETE]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}