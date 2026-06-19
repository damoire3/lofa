'use client'

import { useState } from 'react'
import { IconFileSpreadsheet, IconLoader } from '@tabler/icons-react'

type Payment = {
  id: string
  amount: number
  expectedAmount: number
  status: string
  method: string
  createdAt: Date | string
  dueDate: Date | string
  tenant: {
    firstName: string
    lastName: string
  }
  contract: {
    property: {
      name: string
      city: string
    }
  }
}

export default function ExportExcel({ payments }: { payments: Payment[] }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    setIsLoading(true)

    try {
      const XLSX = await import('xlsx')

      const STATUS_LABELS: Record<string, string> = {
        PAID: 'Payé',
        PARTIAL: 'Partiel',
        PENDING: 'En attente',
        LATE: 'En retard',
      }

      const METHOD_LABELS: Record<string, string> = {
        MOBILE_MONEY: 'Mobile Money',
        CASH: 'Espèces',
        BANK_TRANSFER: 'Virement bancaire',
      }

      const formatXOF = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(amount) + ' FCFA'

      // Prépare les données pour Excel
      const rows = payments.map((p) => ({
        'Locataire': `${p.tenant.firstName} ${p.tenant.lastName}`,
        'Bien': p.contract.property.name,
        'Ville': p.contract.property.city,
        'Montant reçu': formatXOF(p.amount),
        'Montant attendu': formatXOF(p.expectedAmount),
        'Solde restant': p.expectedAmount > p.amount
          ? formatXOF(p.expectedAmount - p.amount)
          : '0 FCFA',
        'Méthode': METHOD_LABELS[p.method] || p.method,
        'Statut': STATUS_LABELS[p.status] || p.status,
        'Date paiement': new Date(p.createdAt).toLocaleDateString('fr-FR'),
        'Date échéance': new Date(p.dueDate).toLocaleDateString('fr-FR'),
      }))

      // Crée le workbook
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()

      // Style de la colonne (largeur auto)
      ws['!cols'] = [
        { wch: 25 }, // Locataire
        { wch: 25 }, // Bien
        { wch: 15 }, // Ville
        { wch: 18 }, // Montant reçu
        { wch: 18 }, // Montant attendu
        { wch: 18 }, // Solde restant
        { wch: 15 }, // Méthode
        { wch: 12 }, // Statut
        { wch: 15 }, // Date paiement
        { wch: 15 }, // Date échéance
      ]

      XLSX.utils.book_append_sheet(wb, ws, 'Paiements')

      // Feuille résumé
      const totalCollected = payments
        .filter((p) => p.status === 'PAID' || p.status === 'PARTIAL')
        .reduce((sum, p) => sum + p.amount, 0)

      const totalPending = payments
        .filter((p) => p.status === 'PENDING' || p.status === 'LATE')
        .reduce((sum, p) => sum + (p.expectedAmount - p.amount), 0)

      const summary = [
        { 'Indicateur': 'Total paiements', 'Valeur': payments.length },
        { 'Indicateur': 'Total encaissé', 'Valeur': formatXOF(totalCollected) },
        { 'Indicateur': 'Total en attente', 'Valeur': formatXOF(totalPending) },
        { 'Indicateur': 'Paiements reçus', 'Valeur': payments.filter((p) => p.status === 'PAID').length },
        { 'Indicateur': 'Paiements partiels', 'Valeur': payments.filter((p) => p.status === 'PARTIAL').length },
        { 'Indicateur': 'Impayés', 'Valeur': payments.filter((p) => p.status === 'LATE').length },
        { 'Indicateur': 'Date export', 'Valeur': new Date().toLocaleDateString('fr-FR') },
      ]

      const wsSummary = XLSX.utils.json_to_sheet(summary)
      wsSummary['!cols'] = [{ wch: 25 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Résumé')

      // Télécharge le fichier
      const fileName = `lofa-rapport-${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.xlsx`
      XLSX.writeFile(wb, fileName)
    } catch (error) {
      console.error('[EXPORT]', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isLoading || payments.length === 0}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
    >
      {isLoading ? (
        <>
          <IconLoader size={16} className="animate-spin" />
          Export...
        </>
      ) : (
        <>
          <IconFileSpreadsheet size={18} />
          Exporter Excel
        </>
      )}
    </button>
  )
}