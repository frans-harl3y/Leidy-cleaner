import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

/**
 * Página Blog - Artigos e dicas
 */
export default function Blog() {
  const artigos = [
    {
      id: 1,
      titulo: 'Dicas para Manter sua Casa Limpa Entre Serviços',
      categoria: 'Dicas',
      data: '2026-02-10',
      autor: 'Leidy',
      resumo: 'Aprenda as melhores práticas para manter sua casa organizada entre nossos serviços de limpeza...',
      conteudo: 'Conteúdo completo do artigo sobre dicas de manutenção...'
    },
    {
      id: 2,
      titulo: 'Como Escolher o Serviço de Limpeza Ideal para seu Negócio',
      categoria: 'Negócio',
      data: '2026-02-08',
      autor: 'Admin',
      resumo: 'Guia completo para empresas escolherem o melhor plano de limpeza profissional...',
      conteudo: 'Conteúdo sobre limpeza comercial e suas vantagens...'
    },
    {
      id: 3,
      titulo: 'Produtos Naturais para Limpeza: Vale a Pena?',
      categoria: 'Sustentabilidade',
      data: '2026-02-05',
      autor: 'Leidy',
      resumo: 'Análise sobre produtos de limpeza naturais e seu impacto na saúde e meio ambiente...',
      conteudo: 'Discussão sobre eco-friendly cleaning products...'
    },
    {
      id: 4,
      titulo: 'Limpeza Profunda: O que Você Precisa Saber',
      categoria: 'Educação',
      data: '2026-02-01',
      autor: 'Admin',
      resumo: 'Tudo sobre o serviço de limpeza profunda: preço, duração e benefícios...',
      conteudo: 'Conteúdo detalhado sobre limpeza profunda...'
    },
    {
      id: 5,
      titulo: 'Alergia e Limpeza: Como Eliminar Ácaros e Poeira',
      categoria: 'Saúde',
      data: '2026-01-28',
      autor: 'Leidy',
      resumo: 'Saiba como reduzir alergias através de técnicas de limpeza específicas...',
      conteudo: 'Guia de limpeza para pessoas com alergias...'
    },
    {
      id: 6,
      titulo: 'Tecnologia na Limpeza: Inovações 2026',
      categoria: 'Tecnologia',
      data: '2026-01-25',
      autor: 'Admin',
      resumo: 'Conheça as novas tecnologias e equipamentos que revolucionam a limpeza...',
      conteudo: 'Artigo sobre inovações em limpeza...'
    },
  ];

  const categorias = ['Todos', 'Dicas', 'Negócio', 'Sustentabilidade', 'Educação', 'Saúde', 'Tecnologia'];
  const [categoriaSelect, setCategoriaSelect] = useState('Todos');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filtered = categoriaSelect === 'Todos'
    ? artigos
    : artigos.filter(a => a.categoria === categoriaSelect);

  return (
    <>
      <Head>
        <title>Blog - Leidy Cleaner</title>
        <meta name="description" content="Dicas, artigos e tendências sobre limpeza profissional" />
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
              📝 Blog & Dicas
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Artigos, dicas e tendências sobre limpeza profissional
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3 justify-center flex-wrap mb-12 overflow-x-auto pb-2">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaSelect(cat)}
                className={`px-6 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                  categoriaSelect === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filtered.map(artigo => (
              <article
                key={artigo.id}
                onClick={() => setSelectedArticle(artigo)}
                className="group cursor-pointer bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {/* Featured Image */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-300 dark:from-blue-900 dark:to-cyan-900 flex items-center justify-center text-6xl relative group-hover:opacity-90 transition-opacity">
                  📷
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                      {artigo.categoria}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(artigo.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {artigo.titulo}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {artigo.resumo}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      Por <strong>{artigo.autor}</strong>
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                      Ler →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-12">
            <h3 className="text-3xl font-black text-white mb-4">📧 Receba Dicas Semanais</h3>
            <p className="text-blue-100 mb-6">Inscreva-se na nossa newsletter e fique atualizado</p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none dark:bg-slate-800 dark:text-white"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-white text-blue-600 font-bold hover:scale-105 transition-transform"
              >
                Inscrever
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={() => setSelectedArticle(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full my-8" onClick={e => e.stopPropagation()}>
            <div className="h-64 bg-gradient-to-br from-blue-400 to-cyan-300 dark:from-blue-900 dark:to-cyan-900 flex items-center justify-center text-9xl">
              📷
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedArticle.titulo}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Por {selectedArticle.autor} • {new Date(selectedArticle.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button onClick={() => setSelectedArticle(null)} className="text-2xl">✕</button>
              </div>

              <span className="inline-block text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded mb-4">
                {selectedArticle.categoria}
              </span>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {selectedArticle.resumo}
              </p>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedArticle.conteudo}
                </p>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="mt-6 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
