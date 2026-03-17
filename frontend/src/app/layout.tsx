import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth-guard';
import { ToastProvider } from '@/components/toast-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Recicla Entulhos',
  description: 'Controle de caçambas e aluguéis',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ToastProvider>
          <AuthGuard>{children}</AuthGuard>
        </ToastProvider>
      </body>
    </html>
  );
}
