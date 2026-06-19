'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

export default function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 to-green-950 rounded-3xl p-12 md:p-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Prêt à simplifier
            <br />
            <span className="text-green-400">votre gestion ?</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Rejoignez les propriétaires et gestionnaires qui font confiance
            à Lofa pour gérer leurs biens en Afrique de l&apos;Ouest.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg shadow-green-500/25"
          >
            Commencer gratuitement
            <IconArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}