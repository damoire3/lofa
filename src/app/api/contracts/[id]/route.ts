import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

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

    const contract = await prisma.contract.findFirst({
      where: { id, userId: session.user.id },
      include: { tenant: true, property: true },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contrat introuvable' }, { status: 404 })
    }

    return NextResponse.json(contract)
  } catch (error) {
    console.error('[CONTRACT_GET]', error)
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

    const contract = await prisma.contract.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contrat introuvable' }, { status: 404 })
    }

    const updated = await prisma.contract.update({
      where: { id },
      data: {
        status: body.status,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        rentAmount: body.rentAmount,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('[CONTRACT_PATCH]', error)
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

    const contract = await prisma.contract.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contrat introuvable' }, { status: 404 })
    }

    await prisma.contract.delete({ where: { id } })

    return NextResponse.json({ message: 'Contrat supprimé' })
  } catch (error) {
    console.error('[CONTRACT_DELETE]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}