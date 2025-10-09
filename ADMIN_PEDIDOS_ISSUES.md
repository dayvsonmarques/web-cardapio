# Problemas na Página Admin/Pedidos

## 🔴 Situação Atual

A página `/admin/pedidos` tem **19 erros de TypeScript** porque foi construída com um modelo de dados diferente do schema atual do Prisma.

### Campos Ausentes no Schema do Prisma:

#### No modelo `Order`:
- ❌ `numeroMesa` / `tableId` - Sistema de mesas não existe
- ❌ `includeService` / `incluirServico` - Taxa de serviço não existe
- ❌ `itens` (deveria ser `items`)
- ❌ `payments` (array) - Só existe um `paymentMethod`
- ❌ `pagamentos` - Não existe sistema de múltiplos pagamentos

#### No modelo `OrderItem`:
- ❌ `nomeProduto` - Só existe `product` (relação)

#### Tipo `Payment` (para múltiplos pagamentos):
- ❌ Não existe no Prisma

#### Modelo `Table` (mesas):
- ❌ Não existe no Prisma

---

## 🎯 Opções de Solução

### **Opção 1: Atualizar Schema do Prisma (RECOMENDADO para restaurantes)**

Se você precisa de sistema de mesas e múltiplos pagamentos, adicione ao schema:

```prisma
model Table {
  id        String   @id @default(uuid())
  number    Int      @unique
  capacity  Int
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  orders    Order[]
  
  @@map("tables")
}

model Order {
  id            String        @id @default(uuid())
  status        OrderStatus   @default(PENDING)
  
  // Mesa (opcional - para delivery não tem mesa)
  tableId       String?
  table         Table?        @relation(fields: [tableId], references: [id], onDelete: SetNull)
  
  // Taxa de serviço (10%)
  includeService Boolean      @default(true)
  serviceFee     Float        @default(0) // Calculado: subtotal * 0.1
  
  // Customer Info
  customerName  String
  customerEmail String
  customerPhone String
  
  // Delivery Address (opcional - para mesas não precisa)
  deliveryStreet       String?
  deliveryNumber       String?
  deliveryComplement   String?
  deliveryNeighborhood String?
  deliveryCity         String?
  deliveryState        String?
  deliveryZipCode      String?
  
  // Payment - REMOVER paymentMethod único
  // paymentMethod PaymentMethod  <-- DELETAR ISSO
  
  // Totals
  subtotal      Float
  total         Float // subtotal + serviceFee
  
  // Notes
  notes         String?
  
  // Relations
  userId        String?
  user          User?      @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  items         OrderItem[]
  payments      Payment[]   // <-- NOVO: múltiplos pagamentos
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  @@map("orders")
}

// Novo modelo para múltiplos pagamentos
model Payment {
  id            String        @id @default(uuid())
  amount        Float
  paymentMethod PaymentMethod
  notes         String?
  
  orderId       String
  order         Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime      @default(now())
  
  @@map("payments")
}
```

**Passos:**
1. Atualizar `prisma/schema.prisma` com os modelos acima
2. Rodar `npm run prisma:migrate` (vai criar nova migration)
3. Atualizar `prisma/seed.ts` para incluir mesas
4. Atualizar página admin para usar novos campos
5. Criar API routes para mesas

---

### **Opção 2: Simplificar Página Admin (MAIS RÁPIDO)**

Se você não precisa de mesas nem múltiplos pagamentos agora, simplifique a página admin:

**Mudanças:**
- Remover sistema de mesas
- Remover taxa de serviço
- Usar apenas um método de pagamento (já existe no Order)
- Focar em listar pedidos de delivery

**Vantagem:** Funciona imediatamente com schema atual
**Desvantagem:** Menos funcionalidades

---

### **Opção 3: Comentar Página Admin Temporariamente**

Simplesmente comentar/desabilitar a rota até decidir qual modelo usar:

```tsx
// src/app/admin/pedidos/page.tsx
export default function PedidosPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Pedidos - Em Desenvolvimento</h1>
      <p>Esta página será reativada após definição do modelo de dados.</p>
    </div>
  );
}
```

---

## 📋 Comparação dos Modelos

| Feature | Schema Atual | Schema com Mesas |
|---------|-------------|------------------|
| Pedidos delivery | ✅ | ✅ |
| Sistema de mesas | ❌ | ✅ |
| Taxa de serviço | ❌ | ✅ |
| Múltiplos pagamentos | ❌ | ✅ |
| Pagamento parcelado | ❌ | ✅ |
| Split de conta | ❌ | ✅ |

---

## 🚀 Recomendação

**Para delivery apenas:** Use **Opção 2** ou **Opção 3**

**Para restaurante com mesas:** Use **Opção 1**

---

## 💡 Próximos Passos

Me diga qual opção você prefere e eu implemento:

1. **"Adiciona mesas e múltiplos pagamentos"** → Opção 1
2. **"Simplifica a página admin"** → Opção 2  
3. **"Desabilita temporariamente"** → Opção 3

Ou se tiver uma ideia diferente, é só descrever!
