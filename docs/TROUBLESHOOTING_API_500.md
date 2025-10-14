# 🔧 Solução para Erro 500 - API delivery-settings

## ❌ Problema

```
GET /api/delivery-settings HTTP/1.1
Status: 500 Internal Server Error
```

## 🔍 Causa Raiz

O erro 500 ocorreu por **dois motivos**:

### 1. DATABASE_URL Incorreta no .env.local

**Antes (Incorreto):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cardapio"
```

**Depois (Correto):**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cardapio?schema=public"
```

### 2. Nome do Modelo Prisma Incorreto

O schema do Prisma estava usando `delivery_settings` (snake_case), mas o código estava chamando `deliverySettings` (camelCase).

**Antes (Incorreto):**
```prisma
model delivery_settings {
  id String @id
  // ...
}
```

**Depois (Correto):**
```prisma
model DeliverySettings {
  id String @id
  // ...
  
  @@map("delivery_settings")  // Mapeia para a tabela no banco
}
```

## ✅ Solução Aplicada

### Passo 1: Corrigir .env.local

```bash
# Arquivo: .env.local

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBYjhwwzku-LQ8jyzNkGuC-AhTo6edSWhw

# Database (CORRIGIDO)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cardapio?schema=public"
```

### Passo 2: Corrigir Schema Prisma

```bash
# Arquivo: prisma/schema.prisma

# Alterado de:
model delivery_settings { ... }

# Para:
model DeliverySettings {
  id String @id
  storeStreet String
  storeNumber String
  storeComplement String?
  storeNeighborhood String
  storeCity String
  storeState String
  storeZipCode String
  deliveryType DeliveryType @default(FIXED)
  fixedCost Float @default(0)
  costPerKm Float @default(0)
  freeDeliveryMinValue Float?
  allowPickup Boolean @default(true)
  isActive Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime

  @@map("delivery_settings")  # Mapeia para tabela no PostgreSQL
}
```

### Passo 3: Regenerar Prisma Client

```bash
npx prisma generate
```

### Passo 4: Reiniciar Servidor

```bash
# Parar servidor (Ctrl+C)
npm run dev
```

## 🧪 Verificação

### Teste 1: Banco de Dados

```bash
node scripts/test-database.js
```

**Saída esperada:**
```
✅ Conexão com banco estabelecida
✅ Configuração encontrada:
{
  "id": "d093557b-3254-4af5-ad70-d50a0ebd4210",
  "storeZipCode": "52070-290",
  "deliveryType": "FIXED_PLUS_KM",
  "costPerKm": 1.3,
  ...
}
```

### Teste 2: API Endpoint

Acesse no navegador:
```
http://localhost:3001/api/delivery-settings
```

**Resposta esperada:**
```json
{
  "id": "...",
  "storeStreet": "Rua Primeiro de Janeiro",
  "storeNumber": "86",
  "storeZipCode": "52070-290",
  "deliveryType": "FIXED_PLUS_KM",
  "costPerKm": 1.3,
  "isActive": true
}
```

### Teste 3: Carrinho com Frete

1. Acesse: http://localhost:3001/cardapio
2. Adicione produtos ao carrinho
3. Vá para: http://localhost:3001/cardapio/carrinho
4. Digite CEP: **52070-290** (CEP da loja)
5. Clique em **OK**

**Resultado esperado:**
```
✓ Distância: 0.5km • Tempo estimado: 2 min
✓ Frete: R$ 0,65 (0.5km × R$ 1,30)
```

## 📊 Estado Atual da Configuração

**Configuração no banco (Recife, PE):**
- CEP Loja: 52070-290
- Tipo de Entrega: FIXED_PLUS_KM
- Custo por KM: R$ 1,30
- Valor Mínimo para Frete Grátis: R$ 20,00
- Retirada no Local: Ativada
- Status: Ativa

## 🔄 Como Funciona Agora

```
Cliente digita CEP → API busca configurações do banco
                     ↓
              Chama Google Maps API
                     ↓
       Calcula distância real (ex: 5.3km)
                     ↓
        Aplica fórmula: Custo Fixo + (km × R$/km)
                     ↓
         Se total pedido ≥ R$ 20,00 → Frete GRÁTIS
                     ↓
              Exibe no carrinho
```

## 📝 Arquivos Modificados

1. ✅ `.env.local` - DATABASE_URL corrigida
2. ✅ `prisma/schema.prisma` - Modelo DeliverySettings com @@map
3. ✅ Prisma Client regenerado
4. ✅ `scripts/test-database.js` - Script de teste criado

## 🎯 Próximos Passos

Agora que a API está funcionando:

1. **Testar cálculo de frete no carrinho**
   - CEPs próximos: 52070-XXX (mesma região)
   - CEPs distantes: 50000-XXX (centro de Recife)

2. **Verificar Google Maps funcionando**
   - Console deve mostrar distância real
   - Não deve usar distância simulada

3. **Ajustar configurações no admin**
   - Acesse: http://localhost:3001/admin/entregas
   - Ajuste custos conforme necessário

## ⚠️ Importante

- **Sempre reinicie o servidor** após mudar `.env.local`
- **Execute `npx prisma generate`** após mudar `schema.prisma`
- **Verifique o console do navegador** para ver logs de erro

## 🎉 Status

✅ **PROBLEMA RESOLVIDO!**

- API /api/delivery-settings funcionando
- Banco de dados conectado
- Configuração de entrega carregada
- Sistema pronto para calcular frete com Google Maps
