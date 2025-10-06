'use client';

import { useState } from 'react';

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Básico',
      description: 'Perfeito para começar',
      monthlyPrice: 'R$ 29,90',
      yearlyPrice: 'R$ 299',
      features: [
        'Cardápio digital ilimitado',
        'Até 50 produtos',
        'R$ 0,99 por venda',
        'Gestão de pedidos',
        'Suporte por email',
        '1 usuário',
        'Tema personalizado',
      ],
      highlighted: false,
    },
    {
      name: 'Profissional',
      description: 'Para restaurantes em crescimento',
      monthlyPrice: 'R$ 79,90',
      yearlyPrice: 'R$ 799',
      features: [
        'Tudo do plano Básico',
        'Produtos ilimitados',
        'R$ 0,99 por venda',
        'Sistema de reservas',
        'Relatórios avançados',
        'Até 5 usuários',
        'Suporte prioritário',
        'Integrações (WhatsApp, iFood)',
        'QR Code personalizado',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      description: 'Para grandes operações',
      monthlyPrice: 'A negociar',
      yearlyPrice: 'A negociar',
      features: [
        'Tudo do plano Profissional',
        'Taxas personalizadas',
        'Usuários ilimitados',
        'Multi-localização',
        'API completa',
        'Suporte 24/7',
        'Gerente de conta dedicado',
        'Treinamento da equipe',
        'SLA garantido',
        'Customizações avançadas',
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="planos" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-base font-semibold mb-4">
            Planos e Preços
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-['Space_Grotesk']">
            Escolha o plano ideal para seu negócio
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Comece gratuitamente por 14 dias. Sem cartão de crédito necessário.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Anual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-gray-800 text-white shadow-2xl scale-105 border-2 border-gray-700'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-green-600 text-white text-base font-bold rounded-full shadow-lg">
                    ⭐ Mais Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3
                  className={`text-2xl font-bold mb-2 font-['Space_Grotesk'] ${
                    plan.highlighted ? 'text-white drop-shadow-sm' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-base ${
                    plan.highlighted ? 'text-white drop-shadow-sm' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div
                  className={`text-4xl font-bold mb-2 font-['Space_Grotesk'] ${
                    plan.highlighted ? 'text-white drop-shadow-md' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </div>
                <p
                  className={`text-base ${
                    plan.highlighted ? 'text-white drop-shadow-sm' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {billingCycle === 'monthly' ? 'por mês' : 'por ano'}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? 'text-white drop-shadow-sm' : 'text-primary'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span
                      className={`text-base ${
                        plan.highlighted ? 'text-white drop-shadow-sm' : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg text-lg font-bold transition-all shadow-lg ${
                  plan.highlighted
                    ? 'bg-white text-gray-900 hover:bg-gray-100 hover:scale-105'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                Começar Agora
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Precisa de um plano personalizado?
          </p>
          <a
            href="#contato"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Entre em contato com nossa equipe
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
