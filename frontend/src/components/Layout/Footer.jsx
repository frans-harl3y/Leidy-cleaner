import React from 'react';
import Link from 'next/link';

/**
 * Footer Component - Moderno e responsivo
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold">
                🧹
              </div>
              <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                Limpeza Pro
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Serviços profissionais de limpeza para residências e comerciais.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                f
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                🔗
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                📧
              </a>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Produto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/servicos">
                  <a className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                    Servicos
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/agendar">
                  <a className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                    Agendar
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/precos">
                  <a className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                    Precos
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre">
                  <a className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                    Sobre
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contato">
                  <a className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                    Contato
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacidade">
                  <a className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                    Privacidade
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600 dark:text-gray-400">📞 +55 51 98030-3740</li>
              <li className="text-gray-600 dark:text-gray-400">📧 contato@limpezapro.com</li>
              <li className="text-gray-600 dark:text-gray-400">📍 Porto Alegre, RS</li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-200 dark:border-slate-700 pt-8 mb-8">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Fique Atualizado</h3>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Inscrever
            </button>
          </form>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 dark:border-slate-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p>Copyright {currentYear} Limpeza Pro. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span>Status: Online</span>
            <span>Versao: 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
