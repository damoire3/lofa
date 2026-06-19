import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Valide les données
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      )
    }

    const { name, email, password, role } = parsed.data

    // Vérifie si l'email existe déjà
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 409 }
      )
    }

    // Hashe le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crée l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        plan: 'FREE',
      },
    })

    return NextResponse.json(
      { message: 'Compte créé avec succès', id: user.id },
      { status: 201 }
    )
 } catch (error) {
  console.error('[REGISTER ERROR]', JSON.stringify(error, null, 2))
  return NextResponse.json(
    { error: 'Erreur serveur', details: String(error) },
    { status: 500 }
  )
}
}