import type { Metadata } from 'next';
import './globals.css';

import { ThemeProvider } from '@/components/providers/theme-theme';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Academia de Manejo San Cristóbal VIP',
    template: '%s | San Cristóbal VIP',
  },
  description: 'Aprende a manejar con los mejores instructores. Clases personalizadas para todas las edades.',
  openGraph: {
    title: 'Academia de Manejo San Cristóbal VIP',
    description: 'Formación de conductores seguros en Ayacucho.',
    locale: 'es_PE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <body className={`min-h-full flex flex-col antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
