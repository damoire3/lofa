'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex items-center justify-between gap-8 px-6 py-3 rounded-full border transition-all duration-300 w-full max-w-4xl ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md border-gray-200 shadow-lg'
            : 'bg-white/60 backdrop-blur-sm border-white/40 shadow-sm'
        }`}
      >
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          lo<span className="text-green-600">fa</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Fonctionnalités
          </Link>
          <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Tarifs
          </Link>
          <Link href="#contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Connexion
          </Link>
          <Link href="/register" className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors font-medium">
            Commencer
          </Link>
        </div>
      </motion.nav>
    </header>
  )
}