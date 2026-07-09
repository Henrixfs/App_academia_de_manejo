import type { Metadata } from 'next';
import { Arvo, Inter } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/providers/theme-theme';

const arvo = Arvo({ variable: '--font-arvo', subsets: ['latin'], weight: ['400', '700'] });
const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Academia de Manejo',
  description: 'Aprende a manejar con los mejores instructores. Clases personalizadas para todas las edades.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${arvo.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className={`min-h-full flex flex-col antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
