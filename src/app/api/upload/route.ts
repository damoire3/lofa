import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('logo') as File

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 })
    }

    // Vérifie le type de fichier
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      return NextResponse.json({ error: 'Format invalide — JPG, PNG, WebP ou SVG uniquement' }, { status: 400 })
    }

    // Vérifie la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop lourd — 2MB maximum' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const fileName = `logos/${session.user.id}.${ext}`

    // Upload vers Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('lofa-assets')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      console.error('[UPLOAD]', uploadError)
      return NextResponse.json({ error: 'Erreur upload' }, { status: 500 })
    }

    // Récupère l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('lofa-assets')
      .getPublicUrl(fileName)

    // Met à jour l'utilisateur en base
    await prisma.user.update({
      where: { id: session.user.id },
      data: { logo: publicUrl },
    })

    return NextResponse.json({ logo: publicUrl })
  } catch (error) {
    console.error('[UPLOAD]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}