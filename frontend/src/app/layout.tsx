import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Limpeza Pro - Plataforma de Agendamento',
  description: 'Agende serviços de limpeza profissional com facilidade',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
