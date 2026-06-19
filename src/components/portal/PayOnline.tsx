'use client'

import { useState } from 'react'
import { IconCreditCard, IconLoader, IconX, IconPhone } from '@tabler/icons-react'
import type { Contract, Property } from '@/types'

type PayOnlineProps = {
  tenantId: string
  tenantPhone: string
  contract: Contract & { property: Property }
}

const NETWORKS = [
  { value: 'MTN', label: 'MTN Mobile Money', emoji: '🟡' },
  { value: 'ORANGE', label: 'Orange Money', emoji: '🟠' },
  { value: 'MOOV', label: 'Moov Money', emoji: '🔵' },
]

export default function PayOnline({ tenantId, tenantPhone, contract }: PayOnlineProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [phone, setPhone] = useState(tenantPhone)
  const [network, setNetwork] = useState('MTN')
  const [amount, setAmount] = useState(contract.rentAmount)

  const hasFlutterwave = !!process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY

  const handlePay = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract.id,
          amount,
          phoneNumber: phone,
          network,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || 'Une erreur est survenue')
        return
      }

      setSuccess(true)
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatXOF = (n: number) =>
    new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(n) + ' FCFA'

  return (
    <>
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
      >
        <IconCreditCard size={18} />
        Payer mon loyer en ligne
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            {/* Header modal */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Payer mon loyer</h3>
              <button
                onClick={() => { setIsOpen(false); setSuccess(false); setError(null) }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-400"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {success ? (
                // Succès
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">✅</div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Demande envoyée !
                  </h4>
                  <p className="text-sm text-gray-500 mb-1">
                    Confirmez le paiement sur votre téléphone.
                  </p>
                  <p className="text-xs text-gray-400">
                    Votre quittance sera disponible automatiquement après confirmation.
                  </p>
                  <button
                    onClick={() => { setIsOpen(false); setSuccess(false) }}
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              ) : !hasFlutterwave ? (
                // Mode démo — Flutterwave non configuré
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🔧</div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Paiement en ligne bientôt disponible
                  </h4>
                  <p className="text-sm text-gray-500">
                    Cette fonctionnalité sera disponible très prochainement. Contactez votre gestionnaire pour payer par Mobile Money ou espèces.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                // Formulaire de paiement
                <>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  {/* Bien concerné */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Bien</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      {contract.property.name}
                    </p>
                  </div>

                  {/* Montant */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Montant (FCFA)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Loyer : {formatXOF(contract.rentAmount)}
                    </p>
                  </div>

                  {/* Réseau */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Réseau Mobile Money
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {NETWORKS.map((n) => (
                        <button
                          key={n.value}
                          type="button"
                          onClick={() => setNetwork(n.value)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            network === n.value
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <span className="text-xl block mb-1">{n.emoji}</span>
                          <span className="text-xs font-medium text-gray-700">{n.value}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Numéro de téléphone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Numéro Mobile Money
                    </label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-green-500 transition-all">
                      <IconPhone size={16} className="text-gray-400 flex-shrink-0" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+229 97 00 00 00"
                        className="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Récapitulatif */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Montant total</span>
                      <span className="font-bold text-green-700">{formatXOF(amount)}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-400">Réseau</span>
                      <span className="text-gray-600">{NETWORKS.find(n => n.value === network)?.label}</span>
                    </div>
                  </div>

                  {/* Bouton payer */}
                  <button
                    onClick={handlePay}
                    disabled={isLoading || !phone || !amount}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <IconLoader size={16} className="animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <IconCreditCard size={16} />
                        Payer {formatXOF(amount)}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Paiement sécurisé par Flutterwave
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}