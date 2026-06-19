import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { paymentSchema } from '@/lib/validations'
import { calculateCommission } from '@/lib/utils'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const payments = await prisma.payment.findMany({
      where: { tenant: { userId: session.user.id } },
      include: {
        tenant: true,
        contract: { include: { property: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('[PAYMENTS_GET]', error)
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

    const parsed = paymentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    // Vérifie que le locataire appartient à cet utilisateur
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: parsed.data.tenantId,
        userId: session.user.id,
      },
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Locataire introuvable' }, { status: 404 })
    }

    // Vérifie que le contrat appartient à ce locataire et cet utilisateur
    const contract = await prisma.contract.findFirst({
      where: {
        id: parsed.data.contractId,
        tenantId: parsed.data.tenantId,
        userId: session.user.id,
      },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contrat introuvable' }, { status: 404 })
    }

    const isPaid = parsed.data.amount >= parsed.data.expectedAmount
    const isPartial = parsed.data.amount < parsed.data.expectedAmount

    const commission = session.user.plan === 'FREE'
      ? calculateCommission(parsed.data.amount)
      : null

    const payment = await prisma.payment.create({
      data: {
        tenantId: parsed.data.tenantId,
        contractId: parsed.data.contractId,
        amount: parsed.data.amount,
        expectedAmount: parsed.data.expectedAmount,
        method: parsed.data.method,
        status: isPaid ? 'PAID' : isPartial ? 'PARTIAL' : 'PENDING',
        dueDate: new Date(parsed.data.dueDate),
        paidAt: new Date(),
        commission,
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('[PAYMENTS_POST]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}