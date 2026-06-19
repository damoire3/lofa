'use client'

import { motion } from 'framer-motion'
import {
  IconBell,
  IconLink,
  IconCreditCard,
  IconFileInvoice,
  IconUsers,
  IconChartBar,
} from '@tabler/icons-react'

const features = [
  {
    icon: <IconBell size={24} className="text-green-500" />,
    title: 'Rappels automatiques',
    desc: 'Vos locataires reçoivent des rappels à J-7, J-3, J-0 puis des relances à J+1, J+3 et J+7 en cas de retard.',
  },
  {
    icon: <IconLink size={24} className="text-green-500" />,
    title: 'Portail locataire',
    desc: 'Chaque locataire accède à son espace via un lien unique envoyé par WhatsApp. Pas de compte, pas de mot de passe.',
  },
  {
    icon: <IconCreditCard size={24} className="text-green-500" />,
    title: 'Mobile Money',
    desc: 'Wave, Orange Money, MTN MoMo, Moov — tous les opérateurs acceptés via Flutterwave. Validation automatique.',
  },
  {
    icon: <IconFileInvoice size={24} className="text-green-500" />,
    title: 'Documents automatiques',
    desc: 'Contrats de bail et quittances générés automatiquement après chaque paiement. Zéro paperasse manuelle.',
  },
  {
    icon: <IconUsers size={24} className="text-green-500" />,
    title: 'Gestion multi-rôles',
    desc: 'Propriétaire individuel ou gestionnaire d\'agence — chacun a son espace dédié avec les bons accès.',
  },
  {
    icon: <IconChartBar size={24} className="text-green-500" />,
    title: 'Rapports détaillés',
    desc: 'Suivez vos encaissements, impayés et performances en temps réel. Rapports PDF exportables.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Fonctionnalités
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Tout ce dont vous avez besoin
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-xl mx-auto"
          >
            Une plateforme complète pensée pour le marché immobilier
            d&apos;Afrique de l&apos;Ouest.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-gray-100 hover:border-green-100 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}