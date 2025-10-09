# 🚀 Fase 2 Implementada: API Integration & JWT Authentication

## ✅ O que foi implementado

### 1. **Autenticação JWT Completa**

#### **JWT Library** (`src/lib/jwt.ts`)
- ✅ Criação de tokens JWT com `jose` library
- ✅ Verificação e decodificação de tokens
- ✅ Tokens expiram em 7 dias
- ✅ Secret key configurável via .env
- ✅ Payload tipado: userId, email, name

#### **Cookies HTTP-Only**
- ✅ Tokens armazenados em cookies seguros
- ✅ `httpOnly: true` - JavaScript não consegue acessar
- ✅ `secure: true` em produção (HTTPS only)
- ✅ `sameSite: 'lax'` - Proteção contra CSRF
- ✅ `maxAge: 7 days` - Expiração automática

### 2. **Novas API Routes de Autenticação**

#### **POST /api/auth/login**
- ✅ Validação de email e senha
- ✅ Comparação de senha com bcrypt
- ✅ Geração de JWT token
- ✅ Set de cookie HTTP-only
- ✅ Retorna user + token

#### **POST /api/auth/logout**
- ✅ Deleta cookie auth-token
- ✅ Limpa sessão do usuário

#### **GET /api/auth/me**
- ✅ Verifica token do cookie
- ✅ Retorna dados do usuário autenticado
- ✅ Inclui endereços
- ✅ Usado para verificar autenticação

#### **POST /api/users (atualizado)**
- ✅ Registro de novo usuário
- ✅ Auto-login após registro (JWT + cookie)
- ✅ Hash de senha automático
- ✅ Validação de email único

### 3. **APIs de Gerenciamento de Endereços**

#### **GET /api/users/[id]/addresses**
- ✅ Lista endereços do usuário
- ✅ Requer autenticação (JWT)
- ✅ Autorização: apenas próprio usuário
- ✅ Ordenado por isDefault

#### **POST /api/users/[id]/addresses**
- ✅ Cria novo endereço
- ✅ Auto-desmarcar outros como padrão se isDefault=true
- ✅ Requer autenticação
- ✅ Autorização: apenas próprio usuário

#### **PUT /api/users/[id]/addresses/[addressId]**
- ✅ Atualiza endereço existente
- ✅ Gerencia flag isDefault
- ✅ Requer autenticação
- ✅ Autorização: apenas próprio usuário

#### **DELETE /api/users/[id]/addresses/[addressId]**
- ✅ Deleta endereço
- ✅ Requer autenticação
- ✅ Autorização: apenas próprio usuário

### 4. **AuthContext Completamente Reescrito**

#### **Antes** (localStorage):
```typescript
// Dados apenas no navegador
localStorage.setItem('users', JSON.stringify(users));
localStorage.setItem('user', JSON.stringify(user));
```

#### **Depois** (API + JWT):
```typescript
// Dados no servidor PostgreSQL + JWT para sessão
const response = await fetch('/api/auth/login', {
  method: 'POST',
  credentials: 'include', // Envia cookies
  body: JSON.stringify({ email, password }),
});
```

#### **Funcionalidades do Novo AuthContext**:

- ✅ **`isLoading`** - Estado de carregamento durante verificação de auth
- ✅ **`checkAuth()`** - Verifica autenticação ao carregar app
- ✅ **`login()`** - Login via API com JWT
- ✅ **`logout()`** - Logout via API, limpa cookie
- ✅ **`register()`** - Registro via API com auto-login
- ✅ **`refreshUser()`** - Recarrega dados do usuário
- ✅ **`addAddress()`** - Agora usa API
- ✅ **`updateAddress()`** - Agora usa API
- ✅ **`deleteAddress()`** - Agora usa API
- ✅ **`setDefaultAddress()`** - Atualiza via API

### 5. **Configuração de Segurança**

#### **.env**
```env
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-minimum-32-characters-long"
```

⚠️ **IMPORTANTE**: Em produção, gerar uma chave segura:
```bash
openssl rand -base64 32
```

#### **Proteção de Rotas**
Todas as APIs de usuário verificam:
1. ✅ Token válido no cookie
2. ✅ Token não expirado
3. ✅ Usuário existe no banco
4. ✅ Usuário tem permissão (apenas próprios dados)

### 6. **Fluxo de Autenticação**

#### **Registro de Novo Usuário:**
```
1. POST /api/users { name, email, phone, password }
2. Servidor hash password com bcrypt
3. Salva usuário no PostgreSQL
4. Gera JWT token
5. Set cookie HTTP-only
6. Retorna { user, token }
7. Frontend atualiza contexto
8. Redirect para área do cliente
```

#### **Login:**
```
1. POST /api/auth/login { email, password }
2. Busca usuário no PostgreSQL
3. Verifica senha com bcrypt.compare()
4. Gera JWT token
5. Set cookie HTTP-only
6. Retorna { user, token }
7. Frontend atualiza contexto
8. Redirect conforme parâmetro ?redirect=
```

#### **Verificação Automática (ao carregar app):**
```
1. GET /api/auth/me (envia cookie automaticamente)
2. Servidor verifica JWT do cookie
3. Busca usuário no PostgreSQL
4. Retorna { user } com endereços
5. Frontend atualiza contexto
6. isAuthenticated = true
```

#### **Logout:**
```
1. POST /api/auth/logout
2. Servidor deleta cookie auth-token
3. Retorna { message: 'Logout successful' }
4. Frontend limpa contexto
5. isAuthenticated = false
```

### 7. **Arquivos Criados/Modificados**

```
src/
  ├── lib/
  │   └── jwt.ts                           # ✅ NOVO - JWT utilities
  │
  ├── context/
  │   ├── AuthContext.tsx                  # ✅ REESCRITO - API integration
  │   └── AuthContext.old.tsx              # 📦 Backup do antigo
  │
  └── app/api/
      ├── auth/
      │   ├── login/route.ts               # ✅ ATUALIZADO - JWT + cookie
      │   ├── logout/route.ts              # ✅ NOVO
      │   └── me/route.ts                  # ✅ NOVO
      │
      ├── users/
      │   ├── route.ts                     # ✅ ATUALIZADO - JWT + cookie
      │   └── [id]/
      │       └── addresses/
      │           ├── route.ts             # ✅ NOVO - GET/POST
      │           └── [addressId]/
      │               └── route.ts         # ✅ NOVO - PUT/DELETE

.env                                       # ✅ ATUALIZADO - JWT_SECRET
.env.example                               # ✅ ATUALIZADO - JWT_SECRET
```

## 🔄 Migração de localStorage para API

### **Users & Addresses**
- ❌ Antes: `localStorage.getItem('users')`
- ✅ Depois: `GET /api/auth/me`

### **Login**
- ❌ Antes: `users.find(u => u.email === email && u.password === password)`
- ✅ Depois: `POST /api/auth/login` + bcrypt + JWT

### **Register**
- ❌ Antes: `localStorage.setItem('users', [...])`
- ✅ Depois: `POST /api/users` + PostgreSQL

### **Addresses**
- ❌ Antes: Manipulação local do array
- ✅ Depois: APIs REST completas (GET/POST/PUT/DELETE)

## 🎯 Próximos Passos (Opcionais)

### 1. **Atualizar CartContext**
CartContext ainda usa localStorage, mas isso é OK:
- ✅ Cart é temporário (antes de finalizar pedido)
- ✅ localStorage é adequado para carrinho
- 🔄 Ao finalizar, `POST /api/orders` salva no PostgreSQL

### 2. **Middleware de Autenticação**
Criar `middleware.ts` para proteger rotas automaticamente:
```typescript
export function middleware(request: NextRequest) {
  // Redirecionar não-autenticados
  const token = request.cookies.get('auth-token');
  if (!token && request.nextUrl.pathname.startsWith('/cardapio/area-cliente')) {
    return NextResponse.redirect('/cardapio/login');
  }
}
```

### 3. **Refresh Token**
Implementar refresh tokens para sessões mais longas:
- Access token: 15 minutos
- Refresh token: 7 dias
- Renovação automática

### 4. **API para Atualizar Perfil**
```typescript
// PUT /api/users/[id]
// Atualizar name, email, phone
```

### 5. **Verificação de Email**
- Enviar email com token de verificação
- Rota: `GET /api/auth/verify-email?token=XXX`

## 📊 Comparação: Antes vs Depois

| Feature | localStorage | API + JWT + PostgreSQL |
|---------|--------------|----------------------|
| **Autenticação** | ❌ Client-side | ✅ Server-side |
| **Segurança** | ⚠️ Visível no browser | ✅ HTTP-only cookies |
| **Persistência** | ❌ Por browser | ✅ Global no servidor |
| **Sincronização** | ❌ Não | ✅ Tempo real |
| **Multi-device** | ❌ Não | ✅ Sim |
| **Password** | ⚠️ Não hasheado | ✅ Bcrypt hash |
| **Expiração** | ❌ Manual | ✅ Automática (JWT) |
| **Escalabilidade** | ❌ Limitado | ✅ Ilimitado |

## 🧪 Como Testar

### 1. **Setup do Banco**
```bash
# Se ainda não fez
npm run prisma:migrate
npm run db:seed
```

### 2. **Iniciar Servidor**
```bash
npm run dev
```

### 3. **Testar Registro**
1. Ir para `/cardapio/login`
2. Clicar em "Criar conta"
3. Preencher dados
4. Registrar
5. Deve fazer login automático e redirecionar

### 4. **Testar Login**
1. Ir para `/cardapio/login`
2. Email: `teste@cardapio.com`
3. Senha: `123456`
4. Login
5. Deve redirecionar para área do cliente

### 5. **Verificar Sessão**
1. Fechar navegador
2. Abrir novamente
3. Ir para `/cardapio/area-cliente`
4. Deve estar logado (cookie persistido)

### 6. **Testar Logout**
1. Na área do cliente, logout
2. Deve limpar sessão
3. Tentar acessar área do cliente
4. Deve pedir login novamente

### 7. **Testar Endereços**
1. Área do cliente → Aba "Endereços"
2. Adicionar endereço
3. Deve salvar no PostgreSQL
4. Editar endereço
5. Deletar endereço
6. Tudo sincronizado com banco

## 🔐 Segurança Implementada

### ✅ Proteções
- **Senhas**: Hasheadas com bcrypt (salt 10)
- **JWT**: Assinado com HS256
- **Cookies**: HTTP-only, Secure, SameSite
- **Auth**: Verificação em todas as rotas protegidas
- **Authorization**: Usuário só acessa próprios dados
- **Env**: Secrets no .env (gitignored)

### ⚠️ TODOs de Segurança (Produção)
- [ ] Rate limiting (ex: express-rate-limit)
- [ ] CORS configurado corretamente
- [ ] Helmet.js para headers de segurança
- [ ] Input validation com Zod/Yup
- [ ] SQL injection prevenido (Prisma já faz)
- [ ] XSS prevenido (React já faz)
- [ ] HTTPS obrigatório em produção

## 📱 Comportamento do Frontend

### **Loading States**
```typescript
const { isLoading, isAuthenticated, user } = useAuth();

if (isLoading) {
  return <LoadingSpinner />;
}

if (!isAuthenticated) {
  return <LoginPage />;
}

return <ProtectedContent />;
```

### **Auto-login ao Registrar**
```typescript
// Não precisa fazer login após registro
// JWT + cookie já setado automaticamente
const success = await register(formData);
if (success) {
  // Já está logado!
  router.push('/cardapio/area-cliente');
}
```

### **Sessão Persistente**
```typescript
// Ao recarregar página, verifica sessão automaticamente
useEffect(() => {
  checkAuth(); // GET /api/auth/me
}, []);
```

---

## 🎉 Status Final

- ✅ **Autenticação JWT** - Completa e funcional
- ✅ **API Integration** - AuthContext usando API
- ✅ **PostgreSQL** - Dados persistidos no servidor
- ✅ **Cookies HTTP-only** - Sessão segura
- ✅ **Endereços** - CRUD completo via API
- ✅ **Segurança** - Bcrypt + JWT + Authorization
- ✅ **UX** - Loading states + auto-login + sessão persistente

**Arquitetura atualizada: Next.js 15 + React 19 + TypeScript + Prisma + PostgreSQL + JWT + HTTP-only Cookies** 🚀🔐

