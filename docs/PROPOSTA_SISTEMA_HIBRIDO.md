# 🎯 Proposta: Sistema Híbrido (Delivery + Restaurante)

## 📋 Conceito

Um sistema que suporta **dois modos de operação** simultaneamente:
- 🏠 **Delivery**: Pedidos online com entrega
- 🍽️ **Restaurante**: Mesas presenciais com comandas

---

## 🏗️ Arquitetura Proposta

### 1️⃣ Adicionar Campo `orderType` (Tipo de Pedido)

```prisma
enum OrderType {
  DELIVERY    // Pedido com entrega
  DINE_IN     // Consumo no local (mesa)
}
```

### 2️⃣ Modelo `Order` Híbrido

Os campos de **delivery** tornam-se **opcionais** (só preenchidos se `orderType = DELIVERY`):

```prisma
model Order {
  id            String        @id @default(uuid())
  
  // ✨ NOVO: Tipo de pedido
  orderType     OrderType     @default(DELIVERY)
  
  status        OrderStatus   @default(PENDING)
  
  // Customer Info
  customerName  String
  customerEmail String
  customerPhone String
  
  // 🏠 DELIVERY: Endereço (opcional - só para delivery)
  deliveryStreet       String?      // Antes: obrigatório
  deliveryNumber       String?      // Antes: obrigatório
  deliveryComplement   String?
  deliveryNeighborhood String?      // Antes: obrigatório
  deliveryCity         String?      // Antes: obrigatório
  deliveryState        String?      // Antes: obrigatório
  deliveryZipCode      String?      // Antes: obrigatório
  
  // 🍽️ RESTAURANTE: Mesa (opcional - só para dine-in)
  tableId       String?
  table         Table?        @relation(fields: [tableId], references: [id], onDelete: SetNull)
  
  // 🍽️ RESTAURANTE: Taxa de serviço (10%)
  includeService Boolean      @default(false)  // false para delivery, true para dine-in
  serviceFee     Float        @default(0)      // Calculado: subtotal * 0.1
  
  // 💰 PAGAMENTOS: Sistema flexível
  // Delivery: geralmente 1 pagamento
  // Dine-in: pode ter múltiplos pagamentos (rachar conta)
  payments      Payment[]
  
  // Totals
  subtotal      Float
  total         Float  // subtotal + serviceFee (se includeService = true)
  
  // Notes
  notes         String?
  
  // Relations
  userId        String?
  user          User?      @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  items         OrderItem[]
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  @@map("orders")
}
```

### 3️⃣ Novo Modelo: `Table` (Mesas)

```prisma
model Table {
  id        String   @id @default(uuid())
  number    Int      @unique        // Número da mesa (1, 2, 3...)
  capacity  Int                     // Capacidade (quantas pessoas)
  isActive  Boolean  @default(true) // Mesa disponível?
  location  String?                 // Ex: "Salão Principal", "Varanda"
  
  orders    Order[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("tables")
}
```

### 4️⃣ Novo Modelo: `Payment` (Múltiplos Pagamentos)

```prisma
model Payment {
  id            String        @id @default(uuid())
  amount        Float                      // Valor pago
  paymentMethod PaymentMethod              // PIX, dinheiro, cartão...
  notes         String?                    // Ex: "Troco para R$ 50"
  isPaid        Boolean       @default(true) // Status do pagamento
  
  orderId       String
  order         Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime      @default(now())
  
  @@map("payments")
}
```

---

## 🎯 Como Funciona na Prática

### Cenário 1: Pedido Delivery 🏠

```typescript
{
  orderType: "DELIVERY",
  customerName: "João Silva",
  customerEmail: "joao@email.com",
  customerPhone: "11999999999",
  
  // ✅ Endereço preenchido
  deliveryStreet: "Rua das Flores",
  deliveryNumber: "123",
  deliveryCity: "São Paulo",
  // ...outros campos de endereço
  
  // ❌ Mesa não preenchida
  tableId: null,
  
  // ❌ Sem taxa de serviço
  includeService: false,
  serviceFee: 0,
  
  // 💰 Geralmente 1 pagamento
  payments: [
    { amount: 50.00, paymentMethod: "PIX" }
  ]
}
```

### Cenário 2: Pedido no Restaurante 🍽️

```typescript
{
  orderType: "DINE_IN",
  customerName: "Maria Santos",
  customerEmail: "maria@email.com",
  customerPhone: "11988888888",
  
  // ❌ Endereço não preenchido
  deliveryStreet: null,
  deliveryNumber: null,
  deliveryCity: null,
  // ...
  
  // ✅ Mesa preenchida
  tableId: "uuid-da-mesa-5",
  
  // ✅ Com taxa de serviço
  includeService: true,
  serviceFee: 5.00,  // 10% de 50.00
  
  // 💰 Pode ter múltiplos pagamentos
  payments: [
    { amount: 30.00, paymentMethod: "CREDIT_CARD", notes: "João" },
    { amount: 25.00, paymentMethod: "PIX", notes: "Maria" }
  ]
}
```

---

## ✅ Validações Necessárias

### No Backend (API Routes):

```typescript
// Ao criar pedido, validar:
if (orderType === 'DELIVERY') {
  // Endereço é obrigatório
  if (!deliveryStreet || !deliveryCity || !deliveryZipCode) {
    return error('Endereço de entrega obrigatório para delivery');
  }
  
  // Mesa não pode estar presente
  if (tableId) {
    return error('Pedidos delivery não têm mesa');
  }
  
  // Taxa de serviço deve ser false
  if (includeService) {
    return error('Pedidos delivery não têm taxa de serviço');
  }
}

if (orderType === 'DINE_IN') {
  // Mesa é obrigatória
  if (!tableId) {
    return error('Mesa obrigatória para pedidos no restaurante');
  }
  
  // Endereço não deve estar presente
  if (deliveryStreet || deliveryCity) {
    return error('Pedidos no restaurante não têm endereço de entrega');
  }
}
```

---

## 📦 Mudanças Necessárias

### 1. Schema do Prisma ✏️
- Adicionar enum `OrderType`
- Adicionar modelo `Table`
- Adicionar modelo `Payment`
- Modificar modelo `Order`:
  - Adicionar `orderType`
  - Tornar campos de delivery opcionais (`?`)
  - Adicionar `tableId`, `includeService`, `serviceFee`
  - Remover `paymentMethod` único
  - Adicionar relação `payments`

### 2. Migration 🗄️
```bash
npm run prisma:migrate
```

### 3. Seed Script 🌱
Atualizar para incluir:
- Algumas mesas (5-10 mesas)
- Pedidos de exemplo (delivery + dine-in)

### 4. API Routes 🛣️
Criar novas rotas:
- `GET/POST /api/tables` - Listar/criar mesas
- `GET/PUT /api/tables/[id]` - Ver/editar mesa
- `GET /api/tables/[id]/current-order` - Pedido ativo da mesa
- Atualizar `POST /api/orders` - Suportar ambos os tipos

### 5. Frontend 🎨
- **Área Admin**: Escolher modo (Delivery / Restaurante)
- **Página Mesas**: Ver status das mesas, abrir/fechar comandas
- **Página Pedidos**: Filtrar por tipo (Delivery / Dine-in)
- **Checkout**: Adaptar formulário conforme tipo

---

## 🎨 Interface Sugerida

### Admin Dashboard:
```
┌─────────────────────────────────────┐
│  [🏠 Delivery]  [🍽️ Restaurante]   │
├─────────────────────────────────────┤
│                                     │
│  Se Delivery:                       │
│    → Lista de pedidos online        │
│    → Mapa de entregas              │
│                                     │
│  Se Restaurante:                    │
│    → Mapa de mesas                 │
│    → Comandas abertas              │
│                                     │
└─────────────────────────────────────┘
```

---

## 📊 Comparação: Antes vs Depois

| Feature | Antes | Depois |
|---------|-------|--------|
| Delivery | ✅ | ✅ |
| Restaurante | ❌ | ✅ |
| Mesas | ❌ | ✅ |
| Taxa de serviço | ❌ | ✅ (opcional) |
| Múltiplos pagamentos | ❌ | ✅ |
| Rachar conta | ❌ | ✅ |
| Sistema flexível | ❌ | ✅ |

---

## 🚀 Ordem de Implementação

1. **Schema** (15 min)
   - Atualizar `prisma/schema.prisma`
   - Rodar migration

2. **Seed** (10 min)
   - Adicionar mesas de exemplo
   - Adicionar pedidos de ambos os tipos

3. **API Routes** (30 min)
   - Criar rotas de mesas
   - Atualizar rota de pedidos
   - Adicionar validações

4. **Página Admin** (20 min)
   - Adaptar para sistema híbrido
   - Adicionar página de mesas

5. **Testes** (10 min)
   - Testar criação de pedidos delivery
   - Testar criação de pedidos dine-in
   - Testar múltiplos pagamentos

**Tempo total estimado**: ~1h30min

---

## 💡 Vantagens da Solução

✅ **Flexível**: Um sistema, dois modos
✅ **Escalável**: Fácil adicionar novos tipos no futuro (takeout, drive-thru)
✅ **Compatível**: Mantém pedidos delivery existentes funcionando
✅ **Eficiente**: Reutiliza mesma infraestrutura
✅ **Profissional**: Sistema completo para restaurante moderno

---

## ❓ Você Aprova?

Se aprovar, vou implementar nesta ordem:
1. ✏️ Atualizar schema
2. 🗄️ Criar migration
3. 🌱 Atualizar seed
4. 🛣️ Criar/atualizar API routes
5. 🎨 Adaptar frontend

**Posso começar?** Ou prefere alguma modificação na proposta?
