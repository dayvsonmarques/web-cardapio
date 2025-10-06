export default function ClientsSection() {
  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Dono - Restaurante Sabor Caseiro',
      content: 'O sistema transformou completamente a forma como gerenciamos nosso restaurante. Os pedidos ficaram mais organizados e reduzimos em 40% o tempo de atendimento.',
      rating: 5,
    },
    {
      name: 'Marina Costa',
      role: 'Gerente - Bistro Gourmet',
      content: 'Implementamos o cardápio digital e em menos de um mês vimos um aumento de 60% nos pedidos online. A interface é incrível!',
      rating: 5,
    },
    {
      name: 'Roberto Almeida',
      role: 'Proprietário - Pizzaria Don Giovanni',
      content: 'Suporte excepcional e sistema muito intuitivo. Nossa equipe se adaptou rapidamente e os clientes adoraram o novo cardápio digital.',
      rating: 5,
    },
  ];

  const logos = [
    'Sabor Caseiro',
    'Bistro Gourmet',
    'Don Giovanni',
    'Cantina Bella',
    'Sushi House',
    'Burguer Master',
  ];

  return (
    <section id="clientes" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mais de 500 restaurantes confiam em nós
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Veja o que nossos clientes têm a dizer sobre nossa plataforma
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client Logos */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Empresas que confiam em nossa plataforma
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-16 px-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <div className="text-center font-bold text-sm opacity-50 hover:opacity-100 transition-opacity">
                  {logo}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-gray-600 dark:text-gray-400">Restaurantes Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50K+</div>
            <div className="text-gray-600 dark:text-gray-400">Pedidos Mensais</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-gray-600 dark:text-gray-400">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-gray-600 dark:text-gray-400">Satisfação</div>
          </div>
        </div>
      </div>
    </section>
  );
}
