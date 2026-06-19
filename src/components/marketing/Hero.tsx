'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  IconArrowRight,
  IconBuildingSkyscraper,
  IconCash,
  IconFileText,
} from '@tabler/icons-react'
import Image from 'next/image'

export default function Hero() {
  const pillars = [
    {
      icon: <IconCash size={22} className="text-green-400" />,
      title: 'Paiements',
      desc: 'Mobile Money, espèces et virements suivis automatiquement.',
    },
    {
      icon: <IconFileText size={22} className="text-green-400" />,
      title: 'Documents',
      desc: 'Contrats et quittances générés automatiquement.',
    },
    {
      icon: (
        <IconBuildingSkyscraper
          size={22}
          className="text-green-400"
        />
      ),
      title: 'Communication',
      desc: 'Rappels WhatsApp et SMS pour éviter les retards.',
    },
  ]

  const DashboardMockup = {
    image: '/images/landing/lofaDashboard.jpg',
    imageAlt: 'Aperçu du dashboard LOFA',
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pt-32 pb-40">

      {/* Glow Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-green-500/15 blur-[180px] rounded-full" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-green-500/20 bg-green-500/10 backdrop-blur-md text-green-300 font-medium mb-10">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Conçu pour l&apos;Afrique francophone
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tight text-white">
            Gérez vos biens
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              automatiquement
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mt-8">
            LOFA centralise la gestion locative :
            loyers, contrats, rappels WhatsApp,
            Mobile Money et suivi des locataires
            dans une seule plateforme.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center gap-5 mt-12"
        >
          <Link
            href="/register"
            className="group bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_40px_rgba(34,197,94,0.35)] flex items-center gap-2"
          >
            Commencer gratuitement
            <IconArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          <Link
            href="#features"
            className="border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white px-8 py-4 rounded-2xl transition"
          >
            Voir les fonctionnalités
          </Link>
        </motion.div>

{/* Dashboard Mockup */}
<motion.div
  initial={{ opacity: 0, y: 60 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="mt-20"
>
  <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 shadow-2xl">
<div className="relative aspect-[1896/881] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black">
  <Image
    src={DashboardMockup.image}
    alt={DashboardMockup.imageAlt}
    fill
    sizes="(max-width: 1024px) 100vw, 1024px"
    className="object-cover"
    priority
  />
</div>
  </div>
</motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mt-16"
        >
          {pillars.map((item, index) => (
            <div
              key={index}
              className="group bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-green-500/30 hover:bg-white/[0.06] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Courbe bas Hero */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-[120px]"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,74.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </div>

    </section>
  )
}