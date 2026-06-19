'use client'

import { useState } from 'react'
import { IconLoader, IconDeviceMobile, IconMail, IconBrandWhatsapp } from '@tabler/icons-react'

type Template = {
  id: string
  type: string
  channel: string
  subject?: string | null
  body: string
}

const TEMPLATE_TYPES = [
  {
    type: 'REMINDER_BEFORE',
    label: 'Rappel avant échéance',
    desc: 'Envoyé à J-7, J-3 et J-0',
  },
  {
    type: 'REMINDER_LATE',
    label: 'Rappel retard',
    desc: 'Envoyé à J+1, J+3 et J+7',
  },
  {
    type: 'PAYMENT_CONFIRMATION',
    label: 'Confirmation de paiement',
    desc: 'Envoyé après chaque paiement validé',
  },
]

const CHANNELS = [
  { channel: 'EMAIL', label: 'Email', icon: <IconMail size={16} />, hasSubject: true },
  { channel: 'SMS', label: 'SMS', icon: <IconDeviceMobile size={16} />, hasSubject: false },
  { channel: 'WHATSAPP', label: 'WhatsApp', icon: <IconBrandWhatsapp size={16} />, hasSubject: false },
]

const DEFAULT_BODIES: Record<string, Record<string, { subject?: string; body: string }>> = {
  REMINDER_BEFORE: {
    EMAIL: {
      subject: 'Rappel — Votre loyer est dû dans {jours} jour(s)',
      body: 'Bonjour {nom},\n\nVotre loyer de {montant} pour {bien} est dû le {date}.\n\nConsultez votre portail : {lien}',
    },
    SMS: { body: '🔔 Bonjour {nom}, votre loyer de {montant} pour {bien} est dû le {date}. Portail : {lien}' },
    WHATSAPP: { body: '🔔 Bonjour {nom}, votre loyer de {montant} pour {bien} est dû le {date}. Portail : {lien}' },
  },
  REMINDER_LATE: {
    EMAIL: {
      subject: '⚠️ Loyer en retard — {jours} jour(s) de retard',
      body: 'Bonjour {nom},\n\nVotre loyer de {montant} pour {bien} est en retard de {jours} jour(s).\n\nConsultez votre portail : {lien}',
    },
    SMS: { body: '⚠️ Bonjour {nom}, votre loyer de {montant} pour {bien} est en retard de {jours} jour(s). Portail : {lien}' },
    WHATSAPP: { body: '⚠️ Bonjour {nom}, votre loyer de {montant} pour {bien} est en retard de {jours} jour(s). Portail : {lien}' },
  },
  PAYMENT_CONFIRMATION: {
    EMAIL: {
      subject: '✅ Paiement confirmé — {montant} pour {bien}',
      body: 'Bonjour {nom},\n\nVotre paiement de {montant} pour {bien} a été reçu.\n\nTéléchargez votre quittance : {lien}',
    },
    SMS: { body: '✅ Bonjour {nom}, votre paiement de {montant} pour {bien} a été confirmé. Quittance : {lien}' },
    WHATSAPP: { body: '✅ Bonjour {nom}, votre paiement de {montant} pour {bien} a été confirmé. Quittance : {lien}' },
  },
}

export default function NotificationTemplatesForm({
  templates,
}: {
  templates: Template[]
}) {
  const [activeType, setActiveType] = useState('REMINDER_BEFORE')
  const [activeChannel, setActiveChannel] = useState('EMAIL')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getTemplate = (type: string, channel: string) => {
    return templates.find((t) => t.type === type && t.channel === channel)
  }

  const getDefault = (type: string, channel: string) => {
    return DEFAULT_BODIES[type]?.[channel] || { body: '' }
  }

  const current = getTemplate(activeType, activeChannel)
  const defaults = getDefault(activeType, activeChannel)
  const hasSubject = CHANNELS.find((c) => c.channel === activeChannel)?.hasSubject

  const [subject, setSubject] = useState(current?.subject || defaults.subject || '')
  const [body, setBody] = useState(current?.body || defaults.body || '')

  const handleTypeChange = (type: string) => {
    setActiveType(type)
    setSuccess(false)
    setError(null)
    const t = getTemplate(type, activeChannel)
    const d = getDefault(type, activeChannel)
    setSubject(t?.subject || d.subject || '')
    setBody(t?.body || d.body || '')
  }

  const handleChannelChange = (channel: string) => {
    setActiveChannel(channel)
    setSuccess(false)
    setError(null)
    const t = getTemplate(activeType, channel)
    const d = getDefault(activeType, channel)
    setSubject(t?.subject || d.subject || '')
    setBody(t?.body || d.body || '')
  }

  const handleReset = () => {
    const d = getDefault(activeType, activeChannel)
    setSubject(d.subject || '')
    setBody(d.body || '')
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/notifications/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeType,
          channel: activeChannel,
          subject: hasSubject ? subject : null,
          body,
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error || 'Erreur lors de la sauvegarde')
        return
      }

      setSuccess(true)
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Sélecteur type */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Type de notification</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TEMPLATE_TYPES.map((t) => (
            <button
              key={t.type}
              onClick={() => handleTypeChange(t.type)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeType === t.type
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <p className={`text-sm font-semibold ${
                activeType === t.type ? 'text-green-700' : 'text-gray-900'
              }`}>
                {t.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Sélecteur canal */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Canal</h2>
        <div className="flex gap-3">
          {CHANNELS.map((c) => (
            <button
              key={c.channel}
              onClick={() => handleChannelChange(c.channel)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                activeChannel === c.channel
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {c.icon}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Éditeur */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Message</h2>
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Réinitialiser par défaut
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">
            Template sauvegardé avec succès ✓
          </div>
        )}

        {hasSubject && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Objet de l&apos;email
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Corps du message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all resize-none font-mono"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isLoading || !body}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <IconLoader size={16} className="animate-spin" />
              Sauvegarde...
            </>
          ) : (
            'Sauvegarder ce template'
          )}
        </button>
      </div>
    </div>
  )
}