import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const updateSchema = z.object({
  amount: z.number().positive().optional(),
  status: z.enum(['PENDING', 'PARTIAL', 'PAID', 'LATE']).optional(),
  method: z.enum(['CASH', 'MOBILE_MONEY', 'BANK_TRANSFER']).optional(),
})

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

    const payment = await prisma.payment.findFirst({
      where: { id, tenant: { userId: session.user.id } },
      include: {
        tenant: true,
        contract: { include: { property: true } },
      },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Paiement introuvable' }, { status: 404 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error('[PAYMENT_GET]', error)
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
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const existing = await prisma.payment.findFirst({
      where: { id, tenant: { userId: session.user.id } },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Paiement introuvable' }, { status: 404 })
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        ...parsed.data,
        ...(parsed.data.status === 'PAID' && { paidAt: new Date() }),
      },
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error('[PAYMENT_PATCH]', error)
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

    const existing = await prisma.payment.findFirst({
      where: { id, tenant: { userId: session.user.id } },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Paiement introuvable' }, { status: 404 })
    }

    await prisma.payment.delete({ where: { id } })

    return NextResponse.json({ message: 'Paiement supprimé' })
  } catch (error) {
    console.error('[PAYMENT_DELETE]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}