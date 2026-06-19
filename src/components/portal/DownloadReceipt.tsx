'use client'

import { useState } from 'react'
import { IconDownload, IconLoader } from '@tabler/icons-react'
import type { Payment, Tenant, Property, Contract } from '@/types'

type ReceiptData = {
  tenant: Tenant
  payment: Payment
  contract: Contract & { property: Property }
  userLogo?: string | null
}

const formatXOF = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA'
}

export default function DownloadReceipt({ data }: { data: ReceiptData }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)

    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      const { tenant, payment, contract } = data
      const property = contract.property

      // ─── HEADER ───────────────────────────────────────────────
      doc.setFillColor(17, 24, 39)
      doc.rect(0, 0, 210, 48, 'F')

      doc.setFillColor(22, 163, 74)
      doc.rect(0, 45, 210, 3, 'F')

      // Logo personnalisé ou logo Lofa par défaut
      if (data.userLogo) {
        try {
          const response = await fetch(data.userLogo)
          const blob = await response.blob()
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
          // Détecte le format
          const format = blob.type.includes('png') ? 'PNG' :
                         blob.type.includes('webp') ? 'WEBP' : 'JPEG'
          doc.addImage(base64, format, 15, 8, 0, 28, undefined, 'FAST')
        } catch {
          // Si le logo échoue, on affiche le logo texte Lofa
          doc.setTextColor(255, 255, 255)
          doc.setFontSize(22)
          doc.setFont('helvetica', 'bold')
          doc.text('lo', 15, 24)
          const loW = doc.getTextWidth('lo')
          doc.setTextColor(74, 222, 128)
          doc.text('fa', 15 + loW, 24)
        }
      } else {
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(22)
        doc.setFont('helvetica', 'bold')
        doc.text('lo', 15, 24)
        const loW = doc.getTextWidth('lo')
        doc.setTextColor(74, 222, 128)
        doc.text('fa', 15 + loW, 24)

        doc.setTextColor(156, 163, 175)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text('Gestion immobiliere simplifiee', 15, 35)
      }

      // Date alignée à droite
      const date = new Date(payment.paidAt || payment.createdAt)
      doc.setTextColor(156, 163, 175)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(
        date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        195, 24, { align: 'right' }
      )

      // Badge "Quittance de loyer"
      doc.setFillColor(22, 163, 74)
      doc.roundedRect(140, 28, 55, 10, 3, 3, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('Quittance de loyer', 167, 35, { align: 'center' })

      // ─── TITRE ────────────────────────────────────────────────
      doc.setTextColor(17, 24, 39)
      doc.setFontSize(15)
      doc.setFont('helvetica', 'bold')
      doc.text('QUITTANCE DE LOYER', 105, 66, { align: 'center' })

      doc.setDrawColor(22, 163, 74)
      doc.setLineWidth(0.5)
      doc.line(15, 71, 195, 71)

      // ─── INFOS LOCATAIRE & BIEN ───────────────────────────────
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39)
      doc.text('Locataire', 15, 83)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(55, 65, 81)
      doc.text(`${tenant.firstName} ${tenant.lastName}`, 15, 91)
      doc.text(tenant.phone, 15, 98)
      if (tenant.email) doc.text(tenant.email, 15, 105)

      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39)
      doc.text('Bien immobilier', 110, 83)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(55, 65, 81)
      doc.text(property.name, 110, 91)
      doc.text(property.address, 110, 98)
      doc.text(property.city, 110, 105)

      doc.setDrawColor(229, 231, 235)
      doc.setLineWidth(0.3)
      doc.line(15, 115, 195, 115)

      // ─── DÉTAILS PAIEMENT ─────────────────────────────────────
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(17, 24, 39)
      doc.text('Details du paiement', 15, 127)

      const tableY = 135
      doc.setFillColor(249, 250, 251)
      doc.rect(15, tableY, 180, 10, 'F')

      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(107, 114, 128)
      doc.text('Description', 20, tableY + 7)
      doc.text('Montant', 175, tableY + 7, { align: 'right' })

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(55, 65, 81)
      doc.setFontSize(10)
      doc.text('Loyer mensuel', 20, tableY + 18)

      const method = payment.method === 'MOBILE_MONEY' ? 'Mobile Money' :
                     payment.method === 'CASH' ? 'Especes' : 'Virement bancaire'
      doc.text(`Methode : ${method}`, 20, tableY + 26)

      const dueDate = new Date(payment.dueDate)
      doc.text(
        `Periode : ${dueDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
        20, tableY + 34
      )

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(22, 163, 74)
      const amount = formatXOF(payment.amount)
      doc.text(amount, 175, tableY + 18, { align: 'right' })

      // Total
      doc.setDrawColor(22, 163, 74)
      doc.setLineWidth(0.5)
      doc.line(15, tableY + 42, 195, tableY + 42)

      doc.setFillColor(240, 253, 244)
      doc.rect(15, tableY + 43, 180, 14, 'F')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(17, 24, 39)
      doc.text('Total paye', 20, tableY + 53)
      doc.setTextColor(22, 163, 74)
      doc.text(amount, 175, tableY + 53, { align: 'right' })

      if (payment.expectedAmount > payment.amount) {
        const remaining = formatXOF(payment.expectedAmount - payment.amount)
        doc.setFillColor(255, 251, 235)
        doc.rect(15, tableY + 62, 180, 10, 'F')
        doc.setFontSize(9)
        doc.setTextColor(180, 83, 9)
        doc.text(`Solde restant du : ${remaining}`, 20, tableY + 69)
      }

      // Note légale
      doc.setFontSize(8)
      doc.setTextColor(156, 163, 175)
      doc.setFont('helvetica', 'normal')
      doc.text(
        'Cette quittance certifie la reception du paiement indique ci-dessus.',
        105, 234, { align: 'center' }
      )
      doc.text(
        'Document genere automatiquement par Lofa · lofa.app',
        105, 241, { align: 'center' }
      )

      // ─── FOOTER ───────────────────────────────────────────────
      doc.setFillColor(22, 163, 74)
      doc.rect(0, 249, 210, 3, 'F')

      doc.setFillColor(17, 24, 39)
      doc.rect(0, 252, 210, 45, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('lo', 105 - doc.getTextWidth('lofa') / 2, 270)

      const loWidth2 = doc.getTextWidth('lo')
      doc.setTextColor(74, 222, 128)
      doc.text('fa', 105 - doc.getTextWidth('lofa') / 2 + loWidth2, 270)

      doc.setTextColor(156, 163, 175)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('Gestion immobiliere simplifiee · Afrique de l\'Ouest', 105, 280, { align: 'center' })

      doc.setTextColor(74, 222, 128)
      doc.setFontSize(7)
      doc.text('lofa.app', 105, 288, { align: 'center' })

      const fileName = `quittance-${tenant.lastName.toLowerCase()}-${dueDate.getMonth() + 1}-${dueDate.getFullYear()}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error('[PDF]', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors w-full justify-center"
    >
      {isLoading ? (
        <>
          <IconLoader size={16} className="animate-spin" />
          Génération...
        </>
      ) : (
        <>
          <IconDownload size={16} />
          Télécharger la quittance
        </>
      )}
    </button>
  )
}