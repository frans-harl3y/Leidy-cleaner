import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Leidy Cleaner - Limpeza Profissional Premium</title>
        <meta name="description" content="Serviços de limpeza profissional com garantia 100%" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
        <Header />

        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            {/* HERO */}
            <section className="mb-24 text-center">
              <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg">
                Sua Casa <span className="text-cyan-400">Impecável</span>
              </h1>
              <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
                Compre horas de limpeza conforme necessário. Sem planos, sem compromisso.
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <Link href="/agendar">
                  <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-lg hover:shadow-2xl transition-all">
                    📅 Agendar Agora
                  </button>
                </Link>
                <Link href="/HourCheckout">
                  <button className="px-8 py-4 rounded-xl border-2 border-cyan-400 text-white font-bold text-lg hover:bg-cyan-400/10 transition-all">
                    💰 Comprar Horas
                  </button>
                </Link>
              </div>
            </section>

            {/* SERVIÇOS */}
            <section className="mb-24">
              <h2 className="text-4xl font-black text-white text-center mb-12 drop-shadow-lg">Serviços por Hora</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: '🧼', name: 'Limpeza Residencial', desc: 'Regular e manutenção' },
                  { icon: '🏗️', name: 'Pós-Obra', desc: 'Limpeza pesada e completa' },
                  { icon: '📦', name: 'Organização', desc: 'Arrumação e organização' }
                ].map((svc, i) => (
                  <div key={i} className="p-8 bg-blue-500/10 rounded-2xl border border-cyan-400/30 backdrop-blur-sm text-center">
                    <p className="text-6xl mb-4">{svc.icon}</p>
                    <h3 className="text-2xl font-bold text-white mb-2">{svc.name}</h3>
                    <p className="text-cyan-100/70">{svc.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* STATS */}
            <section className="mb-24">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🏠', number: '15K+', label: 'Imóveis' },
                  { icon: '⏰', number: '50K+', label: 'Horas' },
                  { icon: '👥', number: '2.5K+', label: 'Clientes' },
                  { icon: '🌟', number: '4.9★', label: 'Rating' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl text-center">
                    <p className="text-5xl mb-2">{stat.icon}</p>
                    <p className="text-3xl font-black">{stat.number}</p>
                    <p className="text-white/80">{stat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="mb-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-black text-white mb-8">Pronto para uma Casa Impecável?</h2>
              <div className="flex gap-4 flex-wrap justify-center">
                <Link href="/agendar">
                  <button className="px-10 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg shadow-xl hover:shadow-2xl">
                    📅 Agendar Agora
                  </button>
                </Link>
                <Link href="/HourCheckout">
                  <button className="px-10 py-4 rounded-xl border-2 border-white text-white font-bold text-lg hover:bg-white/10">
                    💰 Comprar Horas
                  </button>
                </Link>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
