'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Cardápio Digital
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/cardapio" className="text-lg font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
              Cardápio
            </Link>
            <a href="#servicos" className="text-lg font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
              Serviços
            </a>
            <a href="#planos" className="text-lg font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
              Planos
            </a>
            <a href="#clientes" className="text-lg font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
              Clientes
            </a>
            <a href="#contato" className="text-lg font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
              Contato
            </a>
            <Link
              href="/admin"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Acessar Sistema
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-4">
              <Link href="/cardapio" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                Cardápio
              </Link>
              <a href="#servicos" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                Serviços
              </a>
              <a href="#planos" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                Planos
              </a>
              <a href="#clientes" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                Clientes
              </a>
              <a href="#contato" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                Contato
              </a>
              <Link
                href="/admin"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-center"
              >
                Acessar Sistema
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
