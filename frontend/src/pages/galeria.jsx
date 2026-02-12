import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

/**
 * Página Galeria - Portfolio de trabalhos
 */
export default function Galeria() {
  const projetos = [
    {
      id: 1,
      titulo: 'Apartamento de Luxo - São Paulo',
      categoria: 'Residencial',
      fotos: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
      descricao: 'Limpeza profunda em apartamento de 150m²',
      avaliacao: 5,
      cliente: 'Sofia Rodrigues'
    },
    {
      id: 2,
      titulo: 'Escritório Corporativo - Zona Sul',
      categoria: 'Comercial',
      fotos: ['img4.jpg', 'img5.jpg'],
      descricao: 'Limpeza semanal e manutenção de escritório',
      avaliacao: 4.8,
      cliente: 'Tech Innovations LLC'
    },
    {
      id: 3,
      titulo: 'Casa Unifamiliar - Granja Viana',
      categoria: 'Residencial',
      fotos: ['img6.jpg', 'img7.jpg', 'img8.jpg', 'img9.jpg'],
      descricao: 'Limpeza profunda com tratamento especial',
      avaliacao: 4.9,
      cliente: 'Roberto Silva'
    },
    {
      id: 4,
      titulo: 'Condomínio - 30 Unidades',
      categoria: 'Condomínio',
      fotos: ['img10.jpg', 'img11.jpg'],
      descricao: 'Limpeza mensal de todas as áreas',
      avaliacao: 4.7,
      cliente: 'Administração XYZ'
    },
    {
      id: 5,
      titulo: 'Loja de Roupas - Bela Vista',
      categoria: 'Comercial',
      fotos: ['img12.jpg', 'img13.jpg'],
      descricao: 'Limpeza diária com polimento de vitrines',
      avaliacao: 5,
      cliente: 'Fashion Store'
    },
    {
      id: 6,
      titulo: 'Clínica Dentária - Vila Mariana',
      categoria: 'Comercial',
      fotos: ['img14.jpg'],
      descricao: 'Limpeza com esterilização de áreas',
      avaliacao: 4.9,
      cliente: 'Clínica DentalPro'
    },
  ];

  const categorias = ['Todos', 'Residencial', 'Comercial', 'Condomínio'];
  const [categoriaSelect, setCategoriaSelect] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = categoriaSelect === 'Todos' 
    ? projetos 
    : projetos.filter(p => p.categoria === categoriaSelect);

  return (
    <>
      <Head>
        <title>Galeria - Leidy Cleaner</title>
        <meta name="description" content="Veja nossos trabalhos e projetos realizados" />
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
              <Link href="/galeria" className="text-blue-600 dark:text-blue-400 font-semibold">Galeria</Link>
              <Link href="/contato-leidy" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-semibold">Contato</Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              🖼️ Nossos Trabalhos
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Veja alguns dos projetos que realizamos com excelência e dedicação
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3 justify-center flex-wrap mb-12">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaSelect(cat)}
                className={`px-6 py-2 rounded-lg font-bold transition-all ${
                  categoriaSelect === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(projeto => (
              <div
                key={projeto.id}
                onClick={() => setSelectedProject(projeto)}
                className="group cursor-pointer bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                {/* Image */}
                <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center overflow-hidden relative">
                  <div className="text-6xl opacity-50">🏠</div>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <p className="text-white font-bold text-lg">Ver Detalhes</p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex-1">
                      {projeto.titulo}
                    </h3>
                    <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                      {projeto.categoria}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {projeto.descricao}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(projeto.avaliacao) ? '⭐' : '☆'}>
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {projeto.avaliacao}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16 py-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl">
            <h3 className="text-3xl font-black text-white mb-4">Quer um serviço assim?</h3>
            <Link href="/agendar" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-blue-600 font-bold hover:scale-105 transition-transform">
              <span>📅</span>
              Agende Agora
            </Link>
          </div>
        </section>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedProject(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedProject.titulo}
              </h2>
              <button onClick={() => setSelectedProject(null)} className="text-2xl">✕</button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedProject.descricao}
            </p>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-500">Cliente: {selectedProject.cliente}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Categoria: {selectedProject.categoria}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
