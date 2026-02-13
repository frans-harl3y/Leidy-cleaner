'use client';

import React, { useContext } from 'react';
import { ThemeContext, THEME_MODES } from '../../context/ThemeContext';

/**
 * Theme Selector Component - Seletor de temas com 4 modos
 * Claro, Escuro, Alto Contraste e Pastel
 */
export default function ThemeSelector() {
  const { theme, setTheme } = useContext(ThemeContext);

  const themes = [
    { id: THEME_MODES.LIGHT, label: 'Claro', icon: '☀️' },
    { id: THEME_MODES.DARK, label: 'Escuro', icon: '🌙' },
    { id: THEME_MODES.HIGH_CONTRAST, label: 'Alto Contraste', icon: '◆' },
    { id: THEME_MODES.PASTEL, label: 'Pastel', icon: '🎨' },
  ];

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 high-contrast:bg-black high-contrast:border high-contrast:border-white pastel:bg-purple-100/50 backdrop-blur transition-all duration-300">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`
            p-2 rounded transition-all duration-200 flex items-center gap-1 text-sm font-semibold
            ${
              theme === t.id
                ? 'bg-green-500 dark:bg-green-600 text-white shadow-lg scale-110 high-contrast:bg-white high-contrast:text-black pastel:bg-purple-500 pastel:text-white'
                : 'bg-transparent text-gray-600 dark:text-gray-300 high-contrast:text-white high-contrast:border high-contrast:border-white pastel:text-purple-700 hover:bg-gray-200 dark:hover:bg-gray-700 high-contrast:hover:bg-white high-contrast:hover:text-black pastel:hover:bg-purple-200/50'
            }
          `}
          title={`Tema ${t.label}`}
          aria-label={`Mudar para tema ${t.label}`}
        >
          <span>{t.icon}</span>
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}