'use client';

import React, { useState, useContext } from 'react';
import { ThemeContext, THEME_MODES } from '../../context/ThemeContext';

export default function FloatingThemeSwitcher() {
  const { theme, setTheme, themeConfig } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  const themes = Object.values(THEME_MODES);

  // support phone from env (NEXT_PUBLIC_SUPPORT_PHONE) or default
  const supportPhone = (typeof window !== 'undefined' && window.__NEXT_DATA__?.props?.pageProps?.supportPhone) || process?.env?.NEXT_PUBLIC_SUPPORT_PHONE || '5551990303740';

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex items-center gap-2">
        <button
          aria-label="Abrir seletor de tema"
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-white dark:bg-gray-800"
          onClick={() => setOpen(!open)}
        >
          <span className="text-xl">{themeConfig?.icon || '🎨'}</span>
        </button>
      </div>

      {open && (
        <div className="mt-3 p-3 rounded-xl bg-white dark:bg-gray-900 shadow-xl w-40">
          <div className="text-sm font-semibold mb-2">Tema</div>
          <div className="flex flex-col gap-2">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => { setTheme(t); setOpen(false); }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg w-full text-sm font-medium transition-colors ${theme === t ? 'bg-green-600 text-white' : 'bg-transparent text-gray-700 dark:text-gray-200'}`}
              >
                <span>{t}</span>
                {theme === t && <span>✓</span>}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <a
              href={`https://wa.me/${supportPhone}`}
              target="_blank"
              rel="noreferrer noopener"
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white font-semibold"
            >
              📞 Suporte
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
