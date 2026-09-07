# 🚀 Quick Start - Frete por Faixa de Distância

## 📋 Passos Rápidos

### 1. Executar Migração do Banco

```bash
# Adicionar tabela distance_ranges
node scripts/add-distance-ranges.js

# Gerar Prisma Client
npx prisma generate
```

### 2. (Opcional) Adicionar Faixas de Exemplo

```bash
# Exemplo completo (1-3km grátis, 3-5km R$10, etc)
node scripts/add-example-ranges.js

# Ou escolha um tipo específico:
node scripts/add-example-ranges.js restaurante_local
node scripts/add-example-ranges.js ecommerce_regional
node scripts/add-example-ranges.js delivery_premium
```

### 3. Configurar no Admin

1. Acesse: **Admin → Entregas**
2. Clique em **"Editar Configurações"**
3. Selecione tipo: **"Custo Variável por Faixa de Distância"**
4. Configure suas faixas:
   - Clique em **"Adicionar Faixa"**
   - Defina distância mínima e máxima
   - Defina o custo (ou marque como grátis)
   - Repita para todas as faixas
5. Clique em **"Salvar Configurações"**

## 🎯 Exemplo Prático

### Configuração do Usuário (Requisito)

```
1km a 3km   → Frete Grátis
3km a 5km   → R$ 10,00
5km a 7km   → R$ 15,00
7km a 10km  → R$ 20,00
```

### Como Configurar

**Opção 1: Usando Script de Exemplo**
```bash
node scripts/add-example-ranges.js exemplo_completo
```

**Opção 2: Manual no Admin**
1. Admin → Entregas → Editar
2. Tipo: "Custo Variável por Faixa de Distância"
3. Adicionar 4 faixas:

| De (km) | Até (km) | Custo (R$) | Grátis |
|---------|----------|------------|--------|
| 1       | 3        | 0          | ☑      |
| 3       | 5        | 10.00      | ☐      |
| 5       | 7        | 15.00      | ☐      |
| 7       | 10       | 20.00      | ☐      |

## 📊 Exemplos Pré-configurados

### 🍔 Restaurante Local
```bash
node scripts/add-example-ranges.js restaurante_local
```
- 0-2 km → Grátis
- 2-4 km → R$ 5,00
- 4-6 km → R$ 10,00
- 6-8 km → R$ 15,00

### 📦 E-commerce Regional
```bash
node scripts/add-example-ranges.js ecommerce_regional
```
- 0-10 km → Grátis
- 10-30 km → R$ 15,00
- 30-50 km → R$ 30,00
- 50-100 km → R$ 50,00

### 🚚 Delivery Premium
```bash
node scripts/add-example-ranges.js delivery_premium
```
- 0-5 km → R$ 8,00
- 5-10 km → R$ 12,00
- 10-15 km → R$ 18,00
- 15-20 km → R$ 25,00

## ✅ Testar Funcionamento

### No Carrinho do Cliente

1. Adicione produtos ao carrinho
2. Vá para **"Carrinho"**
3. Insira um CEP
4. Sistema calculará:
   - Distância real via Google Maps
   - Faixa correspondente
   - Custo do frete

**Exemplo:**
```
CEP: 01310-100
Distância: 4.5 km

Frete calculado:
→ Está na faixa 3-5km
→ Custo: R$ 10,00
```

## 🔍 Verificar Configuração Atual

```bash
# Abrir Prisma Studio
npx prisma studio

# Ou via código
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const settings = await prisma.deliverySettings.findFirst({
    include: { distanceRanges: true }
  });
  console.log(JSON.stringify(settings, null, 2));
  await prisma.\$disconnect();
})();
"
```

## 📱 Interface do Admin

### Modo Visualização
![View Mode](https://via.placeholder.com/800x400?text=Modo+Visualização)

Mostra:
- ✅ Todas as faixas configuradas
- ✅ Distâncias e custos
- ✅ Indicação de frete grátis

### Modo Edição
![Edit Mode](https://via.placeholder.com/800x400?text=Modo+Edição)

Permite:
- ➕ Adicionar novas faixas
- ✏️ Editar faixas existentes
- 🗑️ Remover faixas
- 👁️ Preview em tempo real

## 🎨 Componentes Criados

### Frontend
- ✅ `DistanceRangeManager.tsx` - Gerenciador de faixas
- ✅ `entregas/page.tsx` - Página admin atualizada

### Backend
- ✅ `prisma/schema.prisma` - Model DistanceRange
- ✅ `api/delivery-settings/route.ts` - CRUD com faixas
- ✅ `hooks/useDeliveryCalculator.ts` - Cálculo com faixas

### Scripts
- ✅ `add-distance-ranges.js` - Criar tabela
- ✅ `add-example-ranges.js` - Adicionar exemplos

### Documentação
- ✅ `RANGE_BASED_DELIVERY.md` - Guia completo

## 🚨 Troubleshooting

### Erro: "Faixas de distância não configuradas"
```bash
# Adicionar faixas de exemplo
node scripts/add-example-ranges.js
```

### Erro: "Prisma Client não encontrado"
```bash
npx prisma generate
```

### Erro: "Tabela distance_ranges não existe"
```bash
node scripts/add-distance-ranges.js
npx prisma generate
```

### Faixas não aparecem no admin
1. Verifique se migração foi executada
2. Regenere Prisma Client: `npx prisma generate`
3. Reinicie servidor: `npm run dev`

## 📚 Documentação Completa

Para mais detalhes, consulte:
- [RANGE_BASED_DELIVERY.md](./RANGE_BASED_DELIVERY.md) - Documentação completa
- [GOOGLE_MAPS_INTEGRATION.md](./GOOGLE_MAPS_INTEGRATION.md) - Configuração API
- [DELIVERY_SETUP.md](./DELIVERY_SETUP.md) - Setup de entregas

## 🎉 Resumo

1. ✅ Execute migração: `node scripts/add-distance-ranges.js`
2. ✅ Gere Prisma Client: `npx prisma generate`
3. ✅ (Opcional) Adicione exemplos: `node scripts/add-example-ranges.js`
4. ✅ Configure no Admin: Entregas → Tipo "Por Faixa"
5. ✅ Teste no carrinho com CEP real

---

**Pronto para usar! 🚀**
