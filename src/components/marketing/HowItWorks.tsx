'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Ajoutez vos biens',
    desc: 'Enregistrez vos appartements, maisons ou locaux commerciaux en quelques clics. Adresse, type, loyer mensuel — tout est centralisé en un seul endroit.',
    image: '/images/landing/step1.jpg',
    imageAlt: 'Immeuble moderne Afrique',
    tag: 'Étape 1',
  },
  {
    number: '02',
    title: 'Créez vos locataires',
    desc: 'Renseignez les informations de chaque locataire avec sa pièce d\'identité. Lofa génère automatiquement un lien unique envoyé par WhatsApp — pas de compte à créer.',
    image: '/images/landing/step2.jpg',
    imageAlt: 'Locataire utilisant son téléphone',
    tag: 'Étape 2',
  },
  {
    number: '03',
    title: 'Gérez les contrats',
    desc: 'Créez un contrat de bail en quelques secondes. Lofa gère les dates, les montants et envoie des rappels automatiques à J-7, J-3 et J-0.',
    image: '/images/landing/step3.jpg',
    imageAlt: 'Signature de contrat',
    tag: 'Étape 3',
  },
  {
    number: '04',
    title: 'Encaissez les loyers',
    desc: 'Wave, Orange Money, MTN MoMo ou espèces — chaque paiement est enregistré, validé et une quittance PDF est générée automatiquement.',
    image: '/images/landing/step4.jpg',
    imageAlt: 'Paiement Mobile Money',
    tag: 'Étape 4',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-green-500 font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Comment ça marche
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4"
          >
            En 4 étapes,
            <br />
            <span className="text-green-400">votre gestion est automatisée</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-xl mx-auto"
          >
            En moins de 5 minutes, votre premier bien est géré sur Lofa.
          </motion.p>
        </div>

        {/* Steps avec photos alternées */}
        <div className="space-y-20">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              {/* Texte */}
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  {step.tag}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-6xl font-bold text-white/5">{step.number}</span>
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-base">
                  {step.desc}
                </p>
              </div>

              {/* Photo */}
              <div className={`relative ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl">
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/40 to-transparent" />
                  {/* Numéro flottant */}
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                </div>
                <div className={`absolute -bottom-3 ${i % 2 === 0 ? '-right-3' : '-left-3'} w-20 h-20 bg-green-500/10 rounded-2xl -z-10`} />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}