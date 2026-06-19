'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Amadou Diallo',
    role: 'Propriétaire · Dakar',
    content: 'Avant Lofa je gérais tout sur Excel. Maintenant mes locataires paient via Wave et je reçois une notification immédiatement. Un gain de temps énorme.',
    avatar: 'AD',
  },
  {
    name: 'Fatou Koné',
    role: 'Gestionnaire · Abidjan',
    content: 'On gère plus de 50 biens pour nos clients. Les rappels automatiques ont réduit nos impayés de 60%. Nos propriétaires voient tout en temps réel.',
    avatar: 'FK',
  },
  {
    name: 'Kofi Mensah',
    role: 'Propriétaire · Cotonou',
    content: 'Le portail locataire est très simple. Même mes locataires qui ne maîtrisent pas internet arrivent à l\'utiliser grâce au lien WhatsApp.',
    avatar: 'KM',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Témoignages
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900"
          >
            Ils nous font confiance
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}