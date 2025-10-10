# Database Setup Guide

Este guia explica como configurar o banco de dados PostgreSQL para o projeto.

## 🗄️ Requisitos

- PostgreSQL instalado (versão 12 ou superior)
- Node.js e npm instalados

## 📦 Instalação do PostgreSQL

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Windows
Baixe o instalador em: https://www.postgresql.org/download/windows/

## 🔧 Configuração do Banco de Dados

### 1. Criar o banco de dados

```bash
# Acesse o PostgreSQL como superusuário
sudo -u postgres psql

# Crie o usuário e o banco (no prompt do psql)
CREATE USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE cardapio;
GRANT ALL PRIVILEGES ON DATABASE cardapio TO postgres;
\q
```

### 2. Configurar variáveis de ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cardapio?schema=public"
```

**Para produção**, substitua pela URL do seu banco:
```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@SEU_HOST:5432/SEU_BANCO?schema=public"
```

## 🚀 Executar Migrations

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Executar as migrations (criar tabelas)
npm run prisma:migrate

# Popular o banco com dados iniciais
npm run db:seed
```

## 📊 Schema do Banco de Dados

### Tabelas criadas:

- **users** - Usuários do sistema
- **addresses** - Endereços dos usuários
- **categories** - Categorias de produtos
- **products** - Produtos do cardápio
- **orders** - Pedidos
- **order_items** - Itens dos pedidos

### Dados de teste:

Após o seed, você terá:
- **Usuário de teste**: `teste@cardapio.com` / Senha: `123456`
- **4 categorias**: Lanches, Bebidas, Sobremesas, Saladas
- **5 produtos de exemplo**

## 🛠️ Comandos Úteis

```bash
# Ver o banco de dados no navegador
npm run prisma:studio

# Criar uma nova migration
npx prisma migrate dev --name nome_da_migration

# Resetar o banco (CUIDADO: apaga todos os dados!)
npx prisma migrate reset

# Ver logs do Prisma
npm run dev  # Com logs de query habilitados em desenvolvimento
```

## 🔍 Prisma Studio

Para visualizar e editar dados diretamente no navegador:

```bash
npm run prisma:studio
```

Isso abrirá `http://localhost:5555` com uma interface visual do banco.

## 🌐 API Endpoints

Após configurar o banco, as seguintes rotas estarão disponíveis:

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/users` - Registrar novo usuário

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/[id]` - Buscar produto por ID
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/[id]` - Atualizar produto (admin)
- `DELETE /api/products/[id]` - Deletar produto (admin)

### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar novo pedido
- `GET /api/orders?userId=XXX` - Pedidos de um usuário
- `GET /api/orders?status=PENDING` - Filtrar por status

## 🚨 Troubleshooting

### Erro: "password authentication failed"
Verifique o usuário e senha no arquivo `.env`

### Erro: "database does not exist"
Crie o banco de dados manualmente:
```bash
sudo -u postgres createdb cardapio
```

### Erro: "relation does not exist"
Execute as migrations:
```bash
npm run prisma:migrate
```

### Resetar tudo e começar do zero
```bash
npx prisma migrate reset
npm run prisma:migrate
npm run db:seed
```

## 📝 Próximos Passos

1. ✅ Configurar o banco de dados local
2. ✅ Executar migrations
3. ✅ Popular com dados de teste
4. 🔄 Atualizar os contextos React para usar a API
5. 🔄 Integrar autenticação com JWT/sessions
6. 🔄 Deploy em produção (Vercel + Railway/Supabase)

## 🔗 Recursos

- [Documentação do Prisma](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
