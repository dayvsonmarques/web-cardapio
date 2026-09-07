# Mensagens de Erro de Entrega

## Resumo das Melhorias

Este documento descreve as mensagens de erro do sistema de cálculo de frete, tornando-as mais específicas e amigáveis para o usuário.

---

## Mensagens Implementadas

### 1. **Destino Fora da Área de Entrega (Limite Geral)**
**Quando:** O endereço está além do limite máximo de entrega configurado em `maxDeliveryDistance`

**Mensagem:**
```
Entrega indisponível, está fora da nossa área de entrega. Entre em contato se quiser combinar outra forma.
```

**Exemplo de configuração que gera essa mensagem:**
- Tipo de entrega: Qualquer tipo (FIXED, VARIABLE, etc.)
- `hasDeliveryLimit`: true
- `maxDeliveryDistance`: 10
- Distância calculada: 15.5km

---

### 2. **Destino Fora das Faixas Configuradas (RANGE_BASED)**
**Quando:** Usando entrega por faixas de distância e o endereço está fora de todas as faixas

**Mensagem:**
```
Entrega indisponível, está fora da nossa área de entrega. Entre em contato se quiser combinar outra forma.
```

**Exemplo de configuração que gera essa mensagem:**
- Tipo de entrega: RANGE_BASED
- Faixas configuradas:
  - 0-2km: R$ 0 (Grátis)
  - 2-5km: R$ 10
- Distância calculada: 8.3km (fora de todas as faixas)

---

### 3. **CEP Inválido ou Distância não Calculável**
**Quando:** O Google Maps API não consegue calcular a distância entre os CEPs

**Mensagem:**
```
Não foi possível calcular a distância para este CEP. Verifique se o CEP está correto.
```

**Causas comuns:**
- CEP inexistente ou inválido
- CEP fora da área de cobertura do Google Maps
- Problemas na API do Google Maps

---

### 4. **Sistema de Entrega Não Configurado**
**Quando:** Entrega por faixas está selecionada mas não há faixas cadastradas

**Mensagem:**
```
Sistema de entrega não configurado corretamente. Entre em contato conosco.
```

**Como resolver:**
- Admin deve acessar "Admin → Entregas"
- Adicionar pelo menos uma faixa de distância
- Salvar a configuração

---

### 5. **Serviço de Entrega Indisponível**
**Quando:** As configurações de entrega estão desativadas (`isActive: false`)

**Mensagem:**
```
Serviço de entrega temporariamente indisponível. Entre em contato conosco.
```

**Como resolver:**
- Admin deve acessar "Admin → Entregas"
- Marcar a opção "Entrega ativa"
- Salvar a configuração

---

### 6. **Erro ao Buscar Configurações**
**Quando:** Falha na comunicação com a API de configurações

**Mensagem:**
```
Erro ao buscar configurações de entrega. Tente novamente.
```

**Causas comuns:**
- Servidor fora do ar
- Problemas de rede
- Erro no banco de dados

---

### 7. **Mensagem Genérica (Fallback)**
**Quando:** Ocorre um erro não especificado

**Mensagem:**
```
Não foi possível calcular o frete para este CEP
```

---

## Características das Mensagens

### Pontos Positivos:
1. **Tom neutro e direto**: sem emojis, texto curto e objetivo
2. **Tom amigável**: mensagens em português claro e educado
3. **Ação sugerida**: quando faz sentido, indica para entrar em contato

---

## Fluxo de Validação

```
┌─────────────────────────────────────┐
│    Usuário digita CEP               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Busca configurações de entrega     │
│  Erro → Mensagem 6                  │
│  isActive = false → Mensagem 5      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Calcula distância via Google Maps  │
│  Falha → Mensagem 3                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Verifica limite geral (se ativo)   │
│  Fora do limite → Mensagem 1        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Calcula custo por tipo             │
│  - RANGE_BASED:                     │
│    Sem faixas → Mensagem 4          │
│    Fora faixas → Mensagem 2         │
│  Sucesso                            │
└─────────────────────────────────────┘
```

---

## Exemplos de Teste

### Teste 1: Limite de Distância Geral
```typescript
// Configuração
{
  deliveryType: 'FIXED',
  hasDeliveryLimit: true,
  maxDeliveryDistance: 10,
  // ... outros campos
}

// Cenários
CEP loja: 52070-290 (Recife)
CEP cliente: 54000-000 (Jaboatão) → ~15km
Resultado: "Entrega indisponível, está fora da nossa área de entrega. Entre em contato se quiser combinar outra forma."
```

### Teste 2: Fora das Faixas
```typescript
// Configuração
{
  deliveryType: 'RANGE_BASED',
  distanceRanges: [
    { minDistance: 0, maxDistance: 3, cost: 0, isFree: true },
    { minDistance: 3, maxDistance: 7, cost: 10, isFree: false }
  ]
}

// Cenários
CEP loja: 52070-290 (Recife)
CEP cliente: 55000-000 (Caruaru) → ~120km
Resultado: "Entrega indisponível, está fora da nossa área de entrega. Entre em contato se quiser combinar outra forma."
```

### Teste 3: CEP Inválido
```typescript
// Cenários
CEP digitado: 00000-000
Resultado: "Não foi possível calcular a distância para este CEP. Verifique se o CEP está correto."
```

---

## Arquivos Modificados

### 1. `src/hooks/useDeliveryCalculator.ts`
- Adicionadas mensagens específicas para cada tipo de erro
- Melhorado tratamento de erros em RANGE_BASED

### 2. `src/app/cardapio/carrinho/page.tsx`
- Atualizada mensagem de fallback
- Melhorada exibição de erro ao usuário

---

## Benefícios

1. **Transparência**: usuário sabe que o endereço está fora da área de entrega
2. **Redução de suporte**: menos chamados perguntando "por que não entrega?"
3. **UX consistente**: mesmo texto para os dois casos de "fora da área de entrega"

---

## Próximos Passos Sugeridos

1. **Adicionar tooltip** com mais informações sobre área de entrega
2. **Mapa visual** mostrando área de cobertura
3. **Sugestão de CEPs próximos** que atendem
4. **Formulário de contato** direto na mensagem de erro
5. **Analytics** para identificar CEPs mais consultados fora da área
