'use client';

import React, { useContext, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { ThemeContext } from '../context/ThemeContext'

export default function Home() {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const getHeroAccentClasses = () => {
    switch(theme) {
      case 'light':
        return 'text-green-600'
      case 'dark':
        return 'text-green-400'
      case 'high-contrast':
        return 'text-yellow-300'
      case 'pastel':
        return 'text-purple-600'
      case 'cyberpunk':
        return 'text-cyan-400 drop-shadow-lg shadow-cyan-500/50'
      case 'forest':
        return 'text-green-300'
      default:
        return 'text-cyan-400'
    }
  }

  const getHeroSubtitleClasses = () => {
    switch(theme) {
      case 'light':
        return 'text-gray-700'
      case 'dark':
        return 'text-gray-300'
      case 'high-contrast':
        return 'text-white'
      case 'pastel':
        return 'text-gray-700'
      case 'cyberpunk':
        return 'text-gray-300'
      case 'forest':
        return 'text-green-100'
      default:
        return 'text-cyan-100'
    }
  }

  const getPrimaryButtonClasses = () => {
    switch(theme) {
      case 'light':
        return 'bg-green-600 hover:bg-green-700 text-white'
      case 'dark':
        return 'bg-green-600 hover:bg-green-700 text-white'
      case 'high-contrast':
        return 'bg-white text-black hover:bg-yellow-300 border-4 border-white'
      case 'pastel':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
      case 'cyberpunk':
        return 'bg-cyan-600 hover:bg-cyan-500 text-black border-2 border-cyan-400 shadow-lg shadow-cyan-500/50'
      case 'forest':
        return 'bg-green-600 hover:bg-green-700 text-white'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  const getSecondaryButtonClasses = () => {
    switch(theme) {
      case 'light':
        return 'border-2 border-green-600 text-green-600 hover:bg-green-50'
      case 'dark':
        return 'border-2 border-green-400 text-green-400 hover:bg-green-900/20'
      case 'high-contrast':
        return 'border-4 border-white text-white hover:bg-white hover:text-black'
      case 'pastel':
        return 'border-2 border-purple-500 text-purple-500 hover:bg-purple-50'
      case 'cyberpunk':
        return 'border-2 border-pink-500 text-pink-400 hover:bg-pink-500/20 shadow-lg shadow-pink-500/30'
      case 'forest':
        return 'border-2 border-green-400 text-green-300 hover:bg-green-700/50'
      default:
        return 'border-2 border-cyan-400 text-cyan-400'
    }
  }

  const getCardBgClasses = () => {
    switch(theme) {
      case 'light':
        return 'bg-white'
      case 'dark':
        return 'bg-gray-800'
      case 'high-contrast':
        return 'bg-white text-black border-4 border-white'
      case 'pastel':
        return 'bg-white'
      case 'cyberpunk':
        return 'bg-gray-900 border-2 border-cyan-500 shadow-lg shadow-cyan-500/30'
      case 'forest':
        return 'bg-green-800/50 border border-green-700'
      default:
        return 'bg-slate-800'
    }
  }

  return (
    <>
      <Head>
        <title>Leidy Cleaner - Limpeza Profissional Premium</title>
        <meta name="description" content="Serviços de limpeza profissional com garantia 100%" />
      </Head>

      <div className={`min-h-screen ${getBackgroundClasses()}`}>
        <Header />

        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            {/* HERO */}
            <section className="mb-24 text-center">
              <h1 className={`text-5xl lg:text-6xl font-black mb-6 drop-shadow-lg ${getHeroTitleClasses()}`}>
                Sua Casa <span className={getHeroAccentClasses()}>Impecável</span>
              </h1>
              <p className={`text-xl mb-8 max-w-2xl mx-auto ${getHeroSubtitleClasses()}`}>
                Pague pelo serviço quando precisar — rápido, seguro e sem complicação.
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <Link href="/login">
                  <button className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all ${getPrimaryButtonClasses()}`}>
                    📅 Agendar Agora
                  </button>
                </Link>
                <Link href="/login">
                  <button className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${getSecondaryButtonClasses()}`}>
                    💳 Pagar Faxinha
                  </button>
                </Link>
                <Link href="/login">
                  <button className={`px-8 py-4 rounded-xl font-bold text-lg transition-all border-2 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20`}>
                    🔐 Fazer Login
                  </button>
                </Link>
              </div>
            </section>

            {/* SERVIÇOS */}
            <section className="mb-24">
              <h2 className={`text-4xl font-black text-center mb-12 drop-shadow-lg ${getHeroTitleClasses()}`}>
                Serviços por Hora
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: '🧼', name: 'Limpeza Residencial', desc: 'Regular e manutenção' },
                  { icon: '🏗️', name: 'Pós-Obra', desc: 'Limpeza pesada e completa' },
                  { icon: '📦', name: 'Organização', desc: 'Arrumação e organização' }
                ].map((service, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all ${getCardBgClasses()}`}
                  >
                    <div className="text-5xl mb-4">{service.icon}</div>
                    <h3 className={`text-xl font-bold mb-2 ${getHeroTitleClasses()}`}>
                      {service.name}
                    </h3>
                    <p className={getHeroSubtitleClasses()}>
                      {service.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Como Funciona */}
            <section className="mb-24">
              <h2 className={`text-4xl font-black text-center mb-12 ${getHeroTitleClasses()}`}>
                Como Funciona
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { num: '1️⃣', step: 'Faça Seu Cadastro', desc: 'Rápido e seguro' },
                  { num: '2️⃣', step: 'Escolha o Serviço', desc: 'Várias opções disponíveis' },
                  { num: '3️⃣', step: 'Agende a Data', desc: 'Conforme sua conveniência' },
                  { num: '4️⃣', step: 'Aproveite!', desc: 'Deixe a limpeza conosco' }
                ].map((item, idx) => (
                  <div key={idx} className={`text-center p-6 rounded-xl ${getCardBgClasses()}`}>
                    <div className="text-4xl mb-3">{item.num}</div>
                    <h3 className={`font-bold text-lg mb-2 ${getHeroTitleClasses()}`}>
                      {item.step}
                    </h3>
                    <p className={`text-sm ${getHeroSubtitleClasses()}`}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className={`text-center rounded-2xl p-12 ${getCardBgClasses()}`}>
              <h2 className={`text-3xl font-black mb-4 ${getHeroTitleClasses()}`}>
                Pronto para Uma Casa Impecável?
              </h2>
              <p className={`text-lg mb-8 ${getHeroSubtitleClasses()}`}>
                Agende seu primeiro serviço com desconto especial para novos clientes!
              </p>
              <Link href="/login">
                <button className={`px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all ${getPrimaryButtonClasses()}`}>
                  🚀 Começar Agora
                </button>
              </Link>
            </section>

          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
