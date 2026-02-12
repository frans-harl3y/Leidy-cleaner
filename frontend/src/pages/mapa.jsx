import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

/**
 * Página Mapa - Cobertura de atendimento
 */
export default function Mapa() {
  const [selectedArea, setSelectedArea] = useState(null);

  const areas = [
    { nome: 'Zona Sul', bairros: 'Pinheiros, Vila Mariana, Morumbi, Higienópolis', cobertura: '100%' },
    { nome: 'Zona Norte', bairros: 'Santana, Cachoeirinha, Jaçanã, Parada de Taipas', cobertura: '95%' },
    { nome: 'Zona Leste', bairros: 'Tatuapé, Aricanduva, São Miguel Paulista', cobertura: '85%' },
    { nome: 'Zona Oeste', bairros: 'Perdizes, Jaguaré, Vila Leopoldina', cobertura: '90%' },
    { nome: 'Centro', bairros: 'Bom Retiro, Brás, Pari, Liberdade', cobertura: '100%' },
    { nome: 'Grande São Paulo', bairros: 'Guarulhos, Osasco, Diadema, ABC', cobertura: '70%' },
  ];

  return (
    <>
      <Head>
        <title>Áreas de Atendimento - Leidy Cleaner</title>
        <meta name="description" content="Veja as áreas onde atuamos em São Paulo" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                🧹
              </div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white">Leidy Cleaner</h1>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/sobre-leidy" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-semibold">Sobre</Link>
              <Link href="/servicos" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-semibold">Serviços</Link>
              <Link href="/galeria" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-semibold">Galeria</Link>
              <Link href="/contato-leidy" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-semibold">Contato</Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              📍 Áreas de Cobertura
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Atuamos em diversos bairros de São Paulo com cobertura abrangente
            </p>
          </div>

          {/* Map Placeholder */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-slate-700 h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl mb-4">🗺️</p>
              <p className="text-gray-600 dark:text-gray-400 font-semibold">
                Mapa Interativo com Google Maps
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                (Mostraria mapa com pins das áreas de atendimento)
              </p>
            </div>
          </div>

          {/* Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {areas.map((area, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedArea(area)}
                className="cursor-pointer bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-blue-500"
              >
                <div className="text-4xl mb-3">📍</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {area.nome}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {area.bairros}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-500">Cobertura:</span>
                  <div className="w-20 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                      style={{ width: area.cobertura }}
                    />
                  </div>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 w-12 text-right">
                    {area.cobertura}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-6 rounded-r-xl mb-12">
            <p className="text-blue-700 dark:text-blue-300 font-semibold mb-2">
              ℹ️ Sua região não está listada?
            </p>
            <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">
              Mesmo que você esteja fora de nossas áreas de cobertura padrão, entre em contato! 
              Oferecemos serviços especiais para locais próximos com agendamentos personalizados.
            </p>
            <Link href="/contato-leidy" className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold hover:text-blue-900">
              ✉️ Faça uma Consulta
            </Link>
          </div>

          {/* CTA */}
          <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl">
            <h3 className="text-3xl font-black text-white mb-4">Atendemos sua região?</h3>
            <Link href="/agendar" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-blue-600 font-bold hover:scale-105 transition-transform">
              <span>📅</span>
              Agende uma Limpeza
            </Link>
          </div>
        </section>
      </div>

      {/* Modal */}
      {selectedArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedArea(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📍 {selectedArea.nome}
              </h2>
              <button onClick={() => setSelectedArea(null)} className="text-2xl">✕</button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Bairros atendidos: <strong>{selectedArea.bairros}</strong>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Taxa de cobertura: <strong>{selectedArea.cobertura}</strong>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Oferecemos serviços regulares e agendamentos personalizados para esta região.
            </p>
            <Link href="/agendar" className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
              📅 Agendar Serviço
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
