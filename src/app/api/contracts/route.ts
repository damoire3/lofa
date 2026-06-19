import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { contractSchema } from '@/lib/validations'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const contracts = await prisma.contract.findMany({
      where: { userId: session.user.id },
      include: {
        tenant: true,
        property: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(contracts)
  } catch (error) {
    console.error('[CONTRACTS_GET]', error)
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

    const parsed = contractSchema.safeParse(body)
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

    // Vérifie que le bien appartient à cet utilisateur
    const property = await prisma.property.findFirst({
      where: {
        id: parsed.data.propertyId,
        userId: session.user.id,
      },
    })

    if (!property) {
      return NextResponse.json({ error: 'Bien introuvable' }, { status: 404 })
    }

    // Garantit "1 bien = 1 contrat actif max" — clôture l'ancien contrat actif de CE BIEN
    // (et non plus du locataire, car le locataire peut avoir d'autres contrats actifs ailleurs)
    await prisma.contract.updateMany({
      where: {
        propertyId: parsed.data.propertyId,
        status: 'ACTIVE',
      },
      data: { status: 'TERMINATED' },
    })

    const contract = await prisma.contract.create({
      data: {
        tenantId: parsed.data.tenantId,
        propertyId: parsed.data.propertyId,
        userId: session.user.id,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        rentAmount: parsed.data.rentAmount,
        deposit: parsed.data.deposit,
        status: 'ACTIVE',
      },
    })

    return NextResponse.json(contract, { status: 201 })
  } catch (error) {
    console.error('[CONTRACTS_POST]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}