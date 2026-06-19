'use client'

import { motion } from 'framer-motion'
import {
  IconShieldCheck,
  IconBell,
  IconDeviceMobile,
  IconCurrencyDollar,
} from '@tabler/icons-react'
import Image from 'next/image'

const stats = [
  { number: '8', label: 'pays couverts', sublabel: 'Zone UEMOA' },
  { number: '5min', label: 'pour démarrer', sublabel: 'Sans formation' },
  { number: '60%', label: 'impayés en moins', sublabel: 'Rappels auto' },
  { number: '100%', label: 'Mobile Money', sublabel: 'Wave, Orange, MTN' },
]

const whyLofaImage = [{
  image: '/images/landing/why-lofa-1.jpg',
  imageAlt: 'Gestion immobilière Afrique',
},
{
  image: '/images/landing/why-lofa-2.jpg',
  imageAlt: 'Portail locataire mobile',
}]

const reasons = [
  {
    icon: <IconDeviceMobile size={20} className="text-green-600" />,
    title: 'Pensé pour le mobile',
    desc: 'Gérez vos biens depuis votre téléphone, même avec une connexion lente.',
  },
  {
    icon: <IconCurrencyDollar size={20} className="text-green-600" />,
    title: 'En XOF, pour l\'Afrique',
    desc: 'Devise locale, Mobile Money natif, prix adaptés au marché ouest-africain.',
  },
  {
    icon: <IconBell size={20} className="text-green-600" />,
    title: 'Rappels automatiques',
    desc: 'Lofa envoie des rappels à J-7, J-3, J-0 et des relances en cas de retard.',
  },
  {
    icon: <IconShieldCheck size={20} className="text-green-600" />,
    title: 'Sécurisé et fiable',
    desc: 'Accès locataire par lien unique — pas de mot de passe à gérer.',
  },
]

export default function WhyLofa() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Pourquoi Lofa
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            La gestion immobilière
            <br />
            <span className="text-green-600">réinventée pour l&apos;Afrique</span>
          </motion.h2>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:border-green-200 transition-colors"
            >
              <p className="text-4xl font-bold text-green-600 mb-1">{stat.number}</p>
              <p className="text-sm font-semibold text-gray-900">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sublabel}</p>
            </div>
          ))}
        </motion.div>

        {/* Section principale — texte + 2 photos juxtaposées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Texte + raisons */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Conçu pour le terrain,
              <br />pas pour les tableaux de bord
            </h3>
            <p className="text-gray-500 leading-relaxed mb-8">
              Lofa n&apos;est pas un outil européen traduit en français. C&apos;est une plateforme construite depuis l&apos;Afrique de l&apos;Ouest, pour les propriétaires et agences qui gèrent des biens au quotidien — avec WhatsApp, Mobile Money et les réalités locales.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reasons.map((reason, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    {reason.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{reason.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

{/* Deux photos juxtaposées */}
<motion.div
  initial={{ opacity: 0, x: 30 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  className="relative"
>
  {/* Photo principale — 1400x800 */}
  <div className="relative rounded-2xl overflow-hidden aspect-[6/4] shadow-xl">
    <Image
      src={whyLofaImage[0].image}
      alt={whyLofaImage[0].imageAlt}
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
  </div>

  {/* Photo secondaire — flottante en bas à droite — 430x930 */}
  <div className="absolute -bottom-6 -right-6 w-28 aspect-[430/930] rounded-xl overflow-hidden shadow-2xl border-4 border-white">
    <Image
      src={whyLofaImage[1].image}
      alt={whyLofaImage[1].imageAlt}
      fill
      sizes="112px"
      className="object-cover"
    />
  </div>

  {/* Badge flottant */}
  <div className="absolute -top-4 -left-4 bg-green-600 text-white rounded-xl px-4 py-3 shadow-lg">
    <p className="text-2xl font-bold">60%</p>
    <p className="text-xs font-medium opacity-80">impayés en moins</p>
  </div>
</motion.div>
        </div>

         {/* Bloc social proof */}
         <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         className="bg-gradient-to-br from-gray-900 to-green-950 rounded-3xl p-10"
         >
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div>
               <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-4">
               Pourquoi nous choisir
               </p>
               <h3 className="text-2xl font-bold text-white mb-4 leading-relaxed">
               Les moins chers, les plus dynamiques,
               et <span className="text-green-400">hyper à l&apos;écoute</span>
               </h3>
               <p className="text-gray-400 leading-relaxed text-sm mb-6">
               Automatisez ce qui vous prenait du temps : loyers, quittances, contrats, rappels. Chaque mois, vos documents sont générés automatiquement, de manière fiable et conforme, avec un minimum d&apos;intervention manuelle. Lofa s&apos;occupe de tout pendant que vous vous concentrez sur l&apos;essentiel.
               </p>

               {/* Note */}
               <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-fit">
               <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((star) => (
                     <svg key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-yellow-400/50'}`} fill="currentColor" viewBox="0 0 20 20">
                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                     </svg>
                  ))}
               </div>
               <span className="text-white font-bold text-sm">4.8</span>
               <span className="text-gray-400 text-xs">· Plus de 1 000 utilisateurs</span>
               </div>
            </div>

            {/* Chiffres */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
               <p className="text-4xl font-bold text-green-400 mb-1">500+</p>
               <p className="text-sm font-medium text-white">Propriétaires</p>
               <p className="text-xs text-gray-500 mt-0.5">et agences inscrits</p>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
               <p className="text-4xl font-bold text-green-400 mb-1">70%</p>
               <p className="text-sm font-medium text-white">Satisfaction</p>
               <p className="text-xs text-gray-500 mt-0.5">utilisateurs satisfaits</p>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
               <p className="text-4xl font-bold text-green-400 mb-1">60%</p>
               <p className="text-sm font-medium text-white">Impayés en moins</p>
               <p className="text-xs text-gray-500 mt-0.5">grâce aux rappels auto</p>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
               <p className="text-4xl font-bold text-green-400 mb-1">8</p>
               <p className="text-sm font-medium text-white">Pays couverts</p>
               <p className="text-xs text-gray-500 mt-0.5">Zone UEMOA</p>
               </div>
            </div>
         </div>
         </motion.div>

      </div>
    </section>
  )
}