import type { Metadata } from 'next';
import { Outfit, Space_Grotesk } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import ToastProvider from '@/components/common/ToastProvider';

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: {
    default: 'Cardápio Digital | Sistema de Gestão de Restaurante',
    template: '%s | Cardápio Digital',
  },
  description: 'Sistema completo de gestão de cardápio digital para restaurantes, com pedidos online, reservas e entregas.',
  keywords: ['cardápio digital', 'restaurante', 'pedidos online', 'delivery', 'reservas'],
  authors: [{ name: 'Cardápio Digital' }],
  creator: 'Cardápio Digital',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} ${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <UserProvider>
            <AuthProvider>
              <CartProvider>
                <SidebarProvider>
                  <ToastProvider />
                  {children}
                </SidebarProvider>
              </CartProvider>
            </AuthProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
