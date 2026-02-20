import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/contexts/AuthContext';
import NotificationBanner from '@/components/NotificationBanner';
import CookieBanner from '@/components/CookieBanner';

export const metadata: Metadata = {
  title: 'Limpar Plus - Limpeza Profissional & Confiável',
  description: 'Serviços de limpeza profissional para residências e empresas. Agende agora mesmo!',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXXXXX');` }} />
      </head>
      <body className="bg-gray-50">
        <AuthProvider>
          <Navbar />
          <CookieBanner />
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
