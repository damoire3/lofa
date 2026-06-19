import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { tenantSchema } from '@/lib/validations'
import { generateToken } from '@/lib/tokens'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const tenants = await prisma.tenant.findMany({
      where: { userId: session.user.id },
      include: {
        contracts: {
          where: { status: 'ACTIVE' },
          include: { property: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tenants)
  } catch (error) {
    console.error('[TENANTS_GET]', error)
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

    const parsed = tenantSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    // Détection de doublon — même téléphone ET même numéro de pièce
    if (parsed.data.idNumber) {
      const existing = await prisma.tenant.findFirst({
        where: {
          userId: session.user.id,
          phone: parsed.data.phone,
          idNumber: parsed.data.idNumber,
        },
        include: {
          contracts: {
            where: { status: 'ACTIVE' },
            include: { property: true },
          },
        },
      })

      if (existing) {
        return NextResponse.json({
          error: 'DUPLICATE',
          message: 'Cette personne existe déjà',
          existingTenant: {
            id: existing.id,
            firstName: existing.firstName,
            lastName: existing.lastName,
            currentProperties: existing.contracts.map((c) => c.property.name),
          },
        }, { status: 409 })
      }
    }

    const token = generateToken()

    const tenant = await prisma.tenant.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null,
        placeOfBirth: parsed.data.placeOfBirth || null,
        nationality: parsed.data.nationality || null,
        idType: parsed.data.idType || null,
        idNumber: parsed.data.idNumber || null,
        token,
        userId: session.user.id,
      },
    })

    return NextResponse.json(tenant, { status: 201 })
  } catch (error) {
    console.error('[TENANTS_POST]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}