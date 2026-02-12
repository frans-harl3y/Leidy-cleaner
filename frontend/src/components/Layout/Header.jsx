import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import ThemeSelector from '../UI/ThemeSelector';
import SiteSearch from '../UI/SiteSearch';

/**
 * Header Component - Premium com logo visual
 */
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/servicos', label: 'Serviços', icon: '✨' },
    { href: '/register', label: 'Criar Conta', icon: '🔐' },
    { href: '/#como_funciona', label: 'Como Funciona', icon: '🔄', isAnchor: true },
    { href: '/dashboard', label: 'Minha Conta', icon: '👤' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 border-b border-blue-500/30 dark:border-blue-600/30 shadow-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo + Brand with Theme Image */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
              {/* Brand Image - Circular with Border */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl overflow-hidden border-2 border-cyan-400 dark:border-cyan-500 hover:border-cyan-300 transition-all hover:shadow-cyan-500/50">
                <Image 
                  src="/logo-leidy.svg" 
                  alt="Leidy Cleaner Brand" 
                  width={64} 
                  height={64} 
                  className="object-cover group-hover:scale-110 duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-300 rounded-full animate-pulse shadow-lg"></div>
              </div>
              {/* Text Brand */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white drop-shadow-sm bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                  Leidy Cleaner
                </h1>
                <p className="text-xs sm:text-sm text-cyan-200 dark:text-cyan-300 font-medium">
                  Limpeza Profissional Premium
                </p>
              </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="px-4 py-2 rounded-lg text-cyan-100 dark:text-cyan-200 hover:bg-blue-800/30 dark:hover:bg-blue-900/50 transition-all font-medium flex items-center gap-2 group hover:text-cyan-300">
                  <span className="group-hover:scale-125 transition-transform">{link.icon}</span>
                  {link.label}
              </Link>
            ))}
          </nav>

          {/* Site search (desktop) */}
          <SiteSearch className="ml-4" />

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeSelector />
            <Link href="/HourCheckout" className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 hover:shadow-lg hover:shadow-cyan-500/50 text-white transition-all font-bold text-sm shadow-lg duration-300">
                <span>💰</span>
                Comprar Horas
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 hover:bg-blue-800/30 dark:hover:bg-blue-900/50 rounded-xl transition-all text-cyan-300"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-2 border-t border-blue-500/30 dark:border-blue-600/30 pt-4 animate-in fade-in slide-up">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} 
                  className="block px-4 py-3 text-cyan-100 dark:text-cyan-200 hover:bg-blue-800/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors font-medium flex items-center gap-2 hover:text-cyan-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{link.icon}</span>
                  {link.label}
              </Link>
            ))}
            <Link href="/HourCheckout" 
                className="block px-4 py-3 mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold text-center hover:shadow-lg transition-all hover:from-cyan-400 hover:to-blue-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                💰 Comprar Horas Agora
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
