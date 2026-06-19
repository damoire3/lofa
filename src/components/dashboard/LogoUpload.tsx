'use client'

import { useState, useRef } from 'react'
import { IconUpload, IconLoader, IconPhoto, IconX } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LogoUpload({ currentLogo, agencyName }: { currentLogo?: string | null; agencyName: string }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentLogo || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Prévisualisation locale
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('logo', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Erreur lors de l\'upload')
        setPreview(currentLogo || null)
        return
      }

      setSuccess(true)
      router.refresh()
    } catch {
      setError('Une erreur est survenue. Réessayez.')
      setPreview(currentLogo || null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async () => {
    setPreview(null)
    setSuccess(false)

    await fetch('/api/upload', {
      method: 'DELETE',
    })

    router.refresh()
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

{preview ? (
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
      <Image
        src={preview}
        alt="Logo"
        width={64}
        height={64}
        className="object-contain"
      />
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-gray-900">{agencyName}</p>
      <p className="text-xs text-gray-400 mb-2">Logo actuel</p>
      <div className="flex gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-xl transition-colors"
        >
          {isLoading ? (
            <IconLoader size={14} className="animate-spin" />
          ) : (
            <IconUpload size={14} />
          )}
          Changer
        </button>
        <button
          onClick={handleRemove}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-3 py-2 rounded-xl transition-colors border border-red-200"
        >
          <IconX size={14} />
          Supprimer
        </button>
      </div>
    </div>
  </div>) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="w-full flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50 rounded-xl p-6 transition-all"
        >
          {isLoading ? (
            <IconLoader size={24} className="text-green-600 animate-spin" />
          ) : (
            <IconPhoto size={24} className="text-gray-400" />
          )}
          <span className="text-sm text-gray-500">
            {isLoading ? 'Upload en cours...' : 'Cliquer pour uploader votre logo'}
          </span>
          <span className="text-xs text-gray-400">JPG, PNG, WebP ou SVG · 2MB max</span>
        </button>
      )}

      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}

      {success && (
        <p className="text-green-600 text-xs">Logo mis à jour avec succès ✓</p>
      )}
    </div>
  )
}