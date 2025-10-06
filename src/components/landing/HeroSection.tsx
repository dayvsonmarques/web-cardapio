import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-base font-semibold">
                🚀 Transforme seu Restaurante
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight font-['Space_Grotesk']">
                Cardápio Digital
                <span className="text-primary"> Completo</span> para seu Negócio
              </h1>
              <p className="text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Sistema SaaS completo de gestão para restaurantes. Cardápio digital, controle de pedidos, reservas e muito mais. Tudo em uma única plataforma moderna e intuitiva.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/admin"
                className="px-8 py-4 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all transform hover:scale-105 text-center shadow-lg"
              >
                Começar Gratuitamente
              </Link>
              <a
                href="#planos"
                className="px-8 py-4 border-2 border-primary text-primary rounded-lg text-lg font-semibold hover:bg-primary hover:text-white transition-all text-center"
              >
                Ver Planos
              </a>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white font-['Space_Grotesk']">500+</div>
                <div className="text-base text-gray-600 dark:text-gray-400">Restaurantes</div>
              </div>
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-700"></div>
              <div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white font-['Space_Grotesk']">50K+</div>
                <div className="text-base text-gray-600 dark:text-gray-400">Pedidos/Mês</div>
              </div>
              <div className="h-12 w-px bg-gray-300 dark:bg-gray-700"></div>
              <div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white font-['Space_Grotesk']">99.9%</div>
                <div className="text-base text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration/Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-blue-500/20 dark:from-primary/10 dark:to-blue-500/10">
                {/* Mockup illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-md p-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">Cardápio Digital</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Online agora</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-8 bg-primary/10 rounded animate-pulse"></div>
                        <div className="flex-1 h-8 bg-primary/10 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
