'use client'

import { useState } from 'react'
import { IconMail, IconBrandWhatsapp, IconMapPin, IconLoader, IconCheck } from '@tabler/icons-react'

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'Une erreur est survenue')
        return
      }

      setSuccess(true)
      setFormData({ name: '', email: '', message: '' })
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className="relative bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs text-green-700 font-medium">Réponse sous 24h</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Discutons de votre projet
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm md:text-base">
            Démo, question technique ou partenariat — notre équipe vous répond rapidement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Infos contact */}
          <div className="md:col-span-2 space-y-3">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-green-200 transition-colors">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                <IconMail size={18} className="text-green-600" />
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
              <p className="text-gray-900 text-sm font-medium">contact@lofa.app</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-green-200 transition-colors">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                <IconBrandWhatsapp size={18} className="text-green-600" />
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">WhatsApp</p>
              <p className="text-gray-900 text-sm font-medium">+229 01 00 00 00 00</p>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-green-200 transition-colors">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center mb-3">
                <IconMapPin size={18} className="text-green-600" />
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Bureau</p>
              <p className="text-gray-900 text-sm font-medium">Cotonou, Bénin</p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:col-span-3 bg-gray-50 border border-gray-100 rounded-2xl p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                <IconCheck size={16} />
                Message envoyé ! Nous vous répondrons rapidement.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Votre nom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
              />
              <input
                type="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
              />
              <textarea
                placeholder="Votre message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all resize-none"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <IconLoader size={16} className="animate-spin" />
                    Envoi...
                  </>
                ) : (
                  'Envoyer le message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}