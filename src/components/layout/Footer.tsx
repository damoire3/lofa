import Link from 'next/link'
import { APP_NAME } from '@/constants'
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandWhatsapp,
} from '@tabler/icons-react'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">

      {/* Courbe haute inversée */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
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

      {/* Glow */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/15 blur-[140px] rounded-full" />
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-12">

        <div className="grid md:grid-cols-4 gap-12">

          {/* Logo */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-3xl font-black tracking-tight"
            >
              lo<span className="text-green-400">fa</span>
            </Link>

            <p className="mt-5 text-gray-400 max-w-md leading-relaxed">
              La plateforme de gestion immobilière pensée pour les
              propriétaires, agences et gestionnaires immobiliers
              en Afrique francophone.
            </p>

            {/* Socials */}
            <div className="flex gap-4 mt-8">
              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-500 hover:text-black transition-all duration-300"
              >
                <IconBrandWhatsapp size={20} />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-500 hover:text-black transition-all duration-300"
              >
                <IconBrandFacebook size={20} />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-500 hover:text-black transition-all duration-300"
              >
                <IconBrandInstagram size={20} />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-500 hover:text-black transition-all duration-300"
              >
                <IconBrandLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Produit */}
          <div>
            <h4 className="font-semibold text-white mb-5">
              Produit
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="#features" className="text-gray-400 hover:text-green-400 transition">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-400 hover:text-green-400 transition">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-gray-400 hover:text-green-400 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-semibold text-white mb-5">
              Légal
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-green-400 transition">
                  Conditions d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-green-400 transition">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Separator */}
        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-sm">
            Conçu par{' '}
            <span className="text-green-400 font-semibold">
              Eriomad
            </span>
          </p>
        </div>

      </div>
    </footer>
  )
}