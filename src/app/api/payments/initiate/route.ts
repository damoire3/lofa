import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { contractId, amount, phoneNumber, network } = body

    if (!contractId || !amount || !phoneNumber) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    // Vérifie que le contrat appartient à cet utilisateur
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: session.user.id,
        status: 'ACTIVE',
      },
      include: {
        tenant: true,
        property: true,
      },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contrat introuvable' }, { status: 404 })
    }

    // Crée d'abord le paiement en base avec statut PENDING
    const payment = await prisma.payment.create({
      data: {
        tenantId: contract.tenantId,
        contractId: contract.id,
        amount: 0, // sera mis à jour par le webhook
        expectedAmount: amount,
        method: 'MOBILE_MONEY',
        status: 'PENDING',
        dueDate: new Date(),
      },
    })

    // Prépare la requête Flutterwave
    const flutterwavePayload = {
      phone_number: phoneNumber,
      amount,
      currency: 'XOF',
      email: contract.tenant.email || `${contract.tenant.phone}@lofa.app`,
      tx_ref: `lofa-${payment.id}-${Date.now()}`,
      fullname: `${contract.tenant.firstName} ${contract.tenant.lastName}`,
      client_ip: '127.0.0.1',
      device_fingerprint: 'lofa-app',
      meta: {
        paymentId: payment.id,
        contractId: contract.id,
        propertyName: contract.property.name,
      },
      network: network || 'MTN', // MTN, ORANGE, MOOV selon le pays
    }

    // Appel à l'API Flutterwave
    const flutterwaveResponse = await fetch(
      'https://api.flutterwave.com/v3/charges?type=mobile_money_franco',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
        body: JSON.stringify(flutterwavePayload),
      }
    )

    const flutterwaveData = await flutterwaveResponse.json()

    if (flutterwaveData.status !== 'success') {
      // Supprime le paiement créé en cas d'échec
      await prisma.payment.delete({ where: { id: payment.id } })

      console.error('[INITIATE]', flutterwaveData)
      return NextResponse.json(
        { error: flutterwaveData.message || 'Erreur Flutterwave' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Paiement initié — en attente de confirmation',
      paymentId: payment.id,
      flutterwaveRef: flutterwaveData.data?.flw_ref,
    })
  } catch (error) {
    console.error('[INITIATE]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}