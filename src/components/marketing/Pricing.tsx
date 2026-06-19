'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { IconCheck, IconX } from '@tabler/icons-react'
import { PLANS, FEATURE_LABELS } from '@/constants/plans'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    { key: 'FREE' as const, popular: false },
    { key: 'PRO' as const, popular: true },
    { key: 'AGENCY' as const, popular: false },
  ]

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Tarifs
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Simple et transparent
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-xl mx-auto mb-8"
          >
            Commencez gratuitement, évoluez selon vos besoins.
          </motion.p>

          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Annuel
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                -17%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map(({ key, popular }, i) => {
            const plan = PLANS[key]
            const price = isYearly ? plan.price.yearly : plan.price.monthly

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  popular
                    ? 'bg-gray-900 text-white shadow-xl scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Populaire
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-lg font-bold mb-4 ${popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-bold ${popular ? 'text-white' : 'text-gray-900'}`}>
                      {price === 0 ? 'Gratuit' : formatCurrency(price)}
                    </span>
                    {price > 0 && (
                      <span className={`text-sm mb-1 ${popular ? 'text-gray-400' : 'text-gray-500'}`}>
                        /{isYearly ? 'an' : 'mois'}
                      </span>
                    )}
                  </div>

                  <div className={`mt-3 text-sm ${popular ? 'text-gray-400' : 'text-gray-500'}`}>
                    {plan.limits.properties === Infinity
                      ? 'Biens illimités'
                      : `${plan.limits.properties} bien${plan.limits.properties > 1 ? 's' : ''}`}
                    {' · '}
                    {plan.limits.tenants === Infinity
                      ? 'Locataires illimités'
                      : `${plan.limits.tenants} locataires`}
                  </div>

                  {plan.commission > 0 && (
                    <div className="mt-2 text-sm text-amber-500 font-medium">
                      5% de commission sur les loyers
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {Object.entries(FEATURE_LABELS).map(([featureKey, label]) => {
                    const hasFeature = plan.features[featureKey as keyof typeof plan.features]
                    return (
                      <li key={featureKey} className="flex items-center gap-3">
                        {hasFeature ? (
                          <IconCheck size={16} className="text-green-500 flex-shrink-0" />
                        ) : (
                          <IconX size={16} className={`flex-shrink-0 ${popular ? 'text-gray-600' : 'text-gray-300'}`} />
                        )}
                        <span className={`text-sm ${
                          hasFeature
                            ? popular ? 'text-gray-200' : 'text-gray-700'
                            : popular ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {label}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                <Link
                  href="/register"
                  className={`w-full text-center py-3 rounded-full font-semibold text-sm transition-all ${
                    popular
                      ? 'bg-green-500 hover:bg-green-400 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {price === 0 ? 'Commencer gratuitement' : 'Choisir ce plan'}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}