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

  // Temas personalizados por tipo
  const themeConfig = {
    light: {
      bg: 'bg-white',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      accentText: 'text-green-600',
      card: 'bg-gray-50 shadow-md',
      button: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl',
      buttonSecondary: 'border-2 border-green-600 text-green-600 hover:bg-green-50'
    },
    dark: {
      bg: 'bg-gray-900',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      accentText: 'text-green-400',
      card: 'bg-gray-800 shadow-lg shadow-black/30',
      button: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-cyan-500/30',
      buttonSecondary: 'border-2 border-green-400 text-green-400 hover:bg-green-900/20'
    },
    forest: {
      bg: 'bg-green-950',
      textPrimary: 'text-green-50',
      textSecondary: 'text-green-200',
      accentText: 'text-green-300',
      card: 'bg-green-900/40 shadow-lg shadow-green-900/50',
      button: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/50',
      buttonSecondary: 'border-2 border-green-400 text-green-300 hover:bg-green-800/40'
    }
  };

  const colors = themeConfig[theme] || themeConfig.light;

  return (
    <>
      <Head>
        <title>Leidy Cleaner - Limpeza Profissional Premium | Pague por Hora</title>
        <meta name="description" content="Serviços de limpeza profissional por hora. Pague apenas pelo que usa. Rápido, seguro e sem complicação." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="limpeza, serviço de limpeza, faxina, profissional, limpar casa" />
      </Head>

      <div className={`min-h-screen ${colors.bg} transition-colors duration-300`}>
        <Header />

        <main className="pt-24 pb-20">
          <div className="max-w-6xl mx-auto px-4">
            
            {/* 🎯 HERO SECTION */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-24 text-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={`text-5xl lg:text-7xl font-black mb-6 leading-tight ${colors.textPrimary}`}
              >
                Sua Casa <span className={colors.accentText}>Impecável</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className={`text-xl lg:text-2xl mb-8 max-w-3xl mx-auto ${colors.textSecondary}`}
              >
                💰 Pague apenas por hora • ⚡ Agendamento rápido • 🔒 100% seguro e confiável
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex gap-3 flex-wrap justify-center"
              >
                <Link href="/login">
                  <button className={`px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${colors.button}`}>
                    📅 Agendar Agora
                  </button>
                </Link>
                <Link href="/register">
                  <button className={`px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${colors.buttonSecondary}`}>
                    👤 Criar Conta
                  </button>
                </Link>
              </motion.div>
            </motion.section>

            {/* 📊 SERVIÇOS */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-24"
            >
              <h2 className={`text-4xl lg:text-5xl font-black text-center mb-16 ${colors.textPrimary}`}>
                Serviços Disponíveis
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: '🧹',
                    title: 'Limpeza Padrão',
                    desc: 'Limpeza regular de sua residência',
                    features: ['Varredura e limpeza', 'Organização', 'Básico']
                  },
                  {
                    icon: '🏗️',
                    title: 'Limpeza Pós-Obra',
                    desc: 'Limpeza pesada após reformas',
                    features: ['Pó de obra', 'Limpeza profunda', 'Janelas']
                  },
                  {
                    icon: '🛋️',
                    title: 'Limpeza Profunda',
                    desc: 'Limpeza completa e detalhada',
                    features: ['Azulejos', 'Estofados', 'Acabamento']
                  }
                ].map((service, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className={`p-8 rounded-2xl hover:shadow-2xl transition-all ${colors.card}`}
                  >
                    <div className="text-6xl mb-4">{service.icon}</div>
                    <h3 className={`text-2xl font-bold mb-3 ${colors.textPrimary}`}>
                      {service.title}
                    </h3>
                    <p className={`mb-6 ${colors.textSecondary}`}>
                      {service.desc}
                    </p>
                    <ul className={`text-sm space-y-2 ${colors.textSecondary}`}>
                      {service.features.map((feature, i) => (
                        <li key={i}>✓ {feature}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* 🎯 COMO FUNCIONA */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-24"
            >
              <h2 className={`text-4xl lg:text-5xl font-black text-center mb-16 ${colors.textPrimary}`}>
                Como Funciona
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { num: '1️⃣', title: 'Cadastre-se', desc: 'Rápido e seguro', time: '2 min' },
                  { num: '2️⃣', title: 'Escolha Serviço', desc: 'Múltiplas opções', time: '1 min' },
                  { num: '3️⃣', title: 'Agende Data', desc: 'Sua conveniência', time: '1 min' },
                  { num: '4️⃣', title: 'Aproveite!', desc: 'Deixe conosco', time: 'Dia marcado' }
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`text-center p-6 rounded-xl ${colors.card}`}
                  >
                    <div className="text-5xl mb-3">{step.num}</div>
                    <h3 className={`font-bold text-lg mb-2 ${colors.textPrimary}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm mb-3 ${colors.textSecondary}`}>
                      {step.desc}
                    </p>
                    <span className={`text-xs font-semibold ${colors.accentText}`}>
                      ~{step.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ✨ DESTAQUES */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-24"
            >
              <h2 className={`text-4xl font-black text-center mb-16 ${colors.textPrimary}`}>
                Por Que Escolher A Leidy Cleaner?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { emoji: '⭐', title: 'Profissionais Treinados', desc: 'Equipe especializada e confiável' },
                  { emoji: '🌿', title: 'Produtos Ecológicos', desc: 'Segurança para sua família' },
                  { emoji: '💰', title: 'Preços Justos', desc: 'Pague apenas pelo que usar' },
                  { emoji: '⏰', title: 'Flexível', desc: 'Agende quando quiser' },
                  { emoji: '📱', title: 'Fácil de Usar', desc: 'App intuitivo e seguro' },
                  { emoji: '✅', title: 'Garantia de Qualidade', desc: '100% satisfação garantida' }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-6 rounded-xl ${colors.card}`}
                  >
                    <div className="text-4xl mb-3">{feature.emoji}</div>
                    <h3 className={`font-bold text-lg mb-2 ${colors.textPrimary}`}>
                      {feature.title}
                    </h3>
                    <p className={colors.textSecondary}>
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* 🚀 CTA FINAL */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={`text-center rounded-2xl p-12 shadow-2xl ${colors.card}`}
            >
              <h2 className={`text-4xl lg:text-5xl font-black mb-4 ${colors.textPrimary}`}>
                🎯 Pronto para Começar?
              </h2>
              <p className={`text-lg mb-8 max-w-2xl mx-auto ${colors.textSecondary}`}>
                Coloque sua casa em boas mãos com a Leidy Cleaner. Agende agora e receba atendimento premium com a melhor qualidade!
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/login">
                  <button className={`px-10 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${colors.button}`}>
                    🚀 Começar Agora
                  </button>
                </Link>
                <Link href="/register">
                  <button className={`px-10 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${colors.buttonSecondary}`}>
                    📝 Se Cadastrar
                  </button>
                </Link>
              </div>
            </motion.section>

          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
