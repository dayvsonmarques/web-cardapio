# TailAdmin Next.js - Free Next.js Tailwind Admin Dashboard Template

TailAdmin is a free and open-source admin dashboard template built on **Next.js and Tailwind CSS** providing developers with everything they need to create a feature-rich and data-driven: back-end, dashboard, or admin panel solution for any sort of web project.

![TailAdmin - Next.js Dashboard Preview](./banner.png)

With TailAdmin Next.js, you get access to all the necessary dashboard UI components, elements, and pages required to build a high-quality and complete dashboard or admin panel. Whether you're building a dashboard or admin panel for a complex web application or a simple website. 

TailAdmin utilizes the powerful features of **Next.js 15** and common features of Next.js such as server-side rendering (SSR), static site generation (SSG), and seamless API route integration. Combined with the advancements of **React 19** and the robustness of **TypeScript**, TailAdmin is the perfect solution to help get your project up and running quickly.

## Overview

TailAdmin provides essential UI components and layouts for building feature-rich, data-driven admin dashboards and control panels. It's built on:

- Next.js 15.x
- React 19
- TypeScript
- Tailwind CSS V4

### Quick Links
- [✨ Visit Website](https://tailadmin.com)
- [📄 Documentation](https://tailadmin.com/docs)
- [⬇️ Download](https://tailadmin.com/download)
- [🖌️ Figma Design File (Community Edition)](https://www.figma.com/community/file/1463141366275764364)
- [⚡ Get PRO Version](https://tailadmin.com/pricing)

### Demos
- [Free Version](https://nextjs-free-demo.tailadmin.com)
- [Pro Version](https://nextjs-demo.tailadmin.com)

### Other Versions
- [HTML Version](https://github.com/TailAdmin/tailadmin-free-tailwind-dashboard-template)
- [React Version](https://github.com/TailAdmin/free-react-tailwind-admin-dashboard)
- [Vue.js Version](https://github.com/TailAdmin/vue-tailwind-admin-dashboard)

## Installation

### Prerequisites
To get started with TailAdmin, ensure you have the following prerequisites installed and set up:

- Node.js 18.x or later (recommended to use Node.js 20.x or later)

### Cloning the Repository
Clone the repository using the following command:

```bash
git clone https://github.com/TailAdmin/free-nextjs-admin-dashboard.git
```

> Windows Users: place the repository near the root of your drive if you face issues while cloning.

1. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
    > Use `--legacy-peer-deps` flag if you face peer-dependency error during installation.

2. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

# 🍽️ Sistema de Cardápio Digital - Restaurante Vegano

Sistema completo de gestão de cardápio digital para restaurantes, com painel administrativo e página pública de visualização. Construído com Next.js 15, React 19, TypeScript e Tailwind CSS.

![Banner do Projeto](./banner.png)

## 📋 Sobre o Projeto

Sistema de cardápio digital completo desenvolvido para restaurantes, oferecendo:

- **Página Pública**: Cardápio interativo com filtros por categoria e informações nutricionais
- **Painel Administrativo**: Gestão completa de produtos, categorias, cardápios, pedidos, reservas e usuários
- **Design Responsivo**: Interface adaptada para desktop, tablet e mobile
- **Multi-idioma**: Suporte para internacionalização (preparado para PT-BR e EN)
- **Tema Escuro/Claro**: Alternância entre modos claro e escuro

## 🚀 Tecnologias

### Core
- **Next.js 15.2.3** - Framework React com SSR e App Router
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS V4** - Framework CSS utilitário

### UI & Visualização
- **ApexCharts** - Gráficos e dashboards
- **FullCalendar** - Calendário para reservas
- **Flatpickr** - Seletor de datas
- **React DnD** - Drag and drop

### Ferramentas
- **ESLint** - Linter de código
- **Prettier** - Formatador de código
- **PostCSS** - Processamento CSS

## 📁 Estrutura do Projeto

```
cardapio/
├── src/
│   ├── app/
│   │   ├── (full-width-pages)/     # Páginas sem layout admin
│   │   │   ├── signin/             # Login
│   │   │   └── signup/             # Cadastro
│   │   ├── admin/                  # Área administrativa
│   │   │   ├── catalogo/           # Gestão de catálogo
│   │   │   │   ├── categorias/     # CRUD de categorias
│   │   │   │   ├── produtos/       # CRUD de produtos
│   │   │   │   └── cardapios/      # CRUD de cardápios
│   │   │   ├── pedidos/            # Gestão de pedidos
│   │   │   ├── reservas/           # Gestão de reservas
│   │   │   ├── gerenciamento/      # Gestão de usuários
│   │   │   └── dashboard/          # Dashboard principal
│   │   ├── cardapio/               # Página pública do cardápio
│   │   └── page.tsx                # Landing page
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── auth/                   # Componentes de autenticação
│   │   ├── cardapio/               # Componentes do cardápio
│   │   ├── landing/                # Componentes da landing page
│   │   ├── header/                 # Headers
│   │   ├── common/                 # Componentes comuns
│   │   └── ui/                     # Componentes UI
│   ├── data/                       # Dados de teste
│   │   └── catalogTestData.ts      # Dados mockados
│   ├── types/                      # Definições TypeScript
│   │   ├── catalog.ts              # Tipos do catálogo
│   │   └── orders.ts               # Tipos de pedidos
│   ├── hooks/                      # Custom hooks
│   ├── context/                    # Context API
│   └── icons/                      # Ícones SVG
├── public/                         # Arquivos públicos
│   └── images/                     # Imagens
├── docs/                           # Documentação adicional
└── README.md                       # Este arquivo
```

## 🎯 Funcionalidades

### Página Pública (Cardápio)
- ✅ Visualização de produtos por categoria
- ✅ Filtros por categoria (Entradas, Pratos Principais, Bebidas, etc.)
- ✅ Informações nutricionais detalhadas
- ✅ Imagens de produtos
- ✅ Preços e descrições
- ✅ Design responsivo e acessível

### Painel Administrativo

#### Catálogo
- ✅ **Produtos**: CRUD completo com upload de imagens, informações nutricionais
- ✅ **Categorias**: Gerenciamento de categorias de produtos
- ✅ **Cardápios**: Criação de cardápios personalizados com produtos

#### Gestão Operacional
- ✅ **Pedidos**: Sistema completo de pedidos com:
  - Gerenciamento de mesas
  - Adição de itens ao pedido
  - Cálculo automático de totais
  - Taxa de serviço (10%)
  - Sistema de pagamentos múltiplos
  - Estados: pendente, preparando, pronto, entregue, pago, cancelado

- ✅ **Reservas**: Gestão de reservas com calendário

#### Administração
- ✅ **Usuários**: Gerenciamento de usuários do sistema
- ✅ **Dashboard**: Visão geral com métricas e gráficos

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18.x ou superior (recomendado 20.x+)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd cardapio
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

> Se encontrar erros de peer dependencies, use: `npm install --legacy-peer-deps`

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse a aplicação:
- Landing Page: http://localhost:3000
- Cardápio: http://localhost:3000/cardapio
- Admin: http://localhost:3000/admin

### Build para Produção

```bash
npm run build
npm start
```

## 📊 Tipos e Dados

O projeto utiliza TypeScript com tipos bem definidos:

### Catálogo (`src/types/catalog.ts`)
- `Product` - Produtos do cardápio
- `Category` - Categorias de produtos
- `Menu` - Cardápios personalizados
- `NutritionalInfo` - Informações nutricionais

### Pedidos (`src/types/orders.ts`)
- `Order` - Pedidos
- `OrderItem` - Itens do pedido
- `Table` - Mesas do restaurante
- `Payment` - Pagamentos
- `OrderStatus` - Estados do pedido: `pending`, `preparing`, `ready`, `delivered`, `paid`, `cancelled`
- `TableStatus` - Estados da mesa: `available`, `occupied`, `reserved`
- `PaymentMethod` - Métodos: `cash`, `credit`, `debit`, `pix`

## 🎨 Temas

O projeto suporta tema claro e escuro, com alternância automática baseada nas preferências do sistema ou manual através da interface.

## 🌍 Internacionalização

Estrutura preparada para multi-idioma com hook `useTranslations` personalizado. Atualmente suporta:
- Português Brasileiro (pt-BR)
- Inglês (en) - em desenvolvimento

## 📝 Dados de Teste

O projeto inclui dados mockados completos em `src/data/catalogTestData.ts`:
- 60 produtos veganos variados
- 5 categorias
- Cardápios de exemplo
- Mesas e pedidos de teste
- Usuários de exemplo

## 🔒 Autenticação

Sistema de autenticação com:
- Tela de login (`/signin`)
- Tela de cadastro (`/signup`)
- Rotas protegidas na área administrativa

## 📸 Imagens

Todas as imagens de produtos são servidas via Unsplash, garantindo:
- Alta qualidade
- Carregamento otimizado
- Fallback para imagens via placeholder

## 🐛 Solução de Problemas

### Porta em uso
Se a porta 3000 estiver em uso, o Next.js automaticamente tentará a próxima disponível (3001, 3002, etc.)

### Erros de Build
Execute `rm -rf .next` e `npm run build` novamente para limpar o cache.

### Imagens não carregam
Verifique a configuração de domínios permitidos em `next.config.ts`.

## 📚 Documentação Adicional

Documentos técnicos disponíveis em `/docs`:
- `CODE_STYLE_GUIDE.md` - Guia de estilo de código
- `MIGRATION_COMPLETE.md` - Histórico de migrações
- `MULTI_IDIOMAS.md` - Implementação de i18n
- E outros...

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença especificada no arquivo `LICENSE`.

## 🙏 Créditos

Baseado no template [TailAdmin Next.js](https://github.com/TailAdmin/free-nextjs-admin-dashboard) - Dashboard administrativo gratuito com Next.js e Tailwind CSS.

---