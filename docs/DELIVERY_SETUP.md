# Configuração de Entregas - Setup

## 1. Executar Migration do Prisma

Após adicionar o modelo `DeliverySettings` ao schema do Prisma, execute:

```bash
npx prisma generate
npx prisma migrate dev --name add-delivery-settings
```

## 2. Estrutura Implementada

### Modelo de Dados (Prisma Schema)

- **DeliverySettings**: Configurações de entrega da loja
  - Endereço completo da loja
  - Tipo de entrega (Fixed, Variable, Fixed+KM, Free Above Value)
  - Custos configuráveis
  - Opção de retirada

### Tipos de Entrega

1. **FIXED**: Custo fixo de entrega
2. **VARIABLE**: Custo baseado em distância (R$/km)
3. **FIXED_PLUS_KM**: Custo fixo + valor por quilômetro
4. **FREE_ABOVE_VALUE**: Frete grátis para pedidos acima de determinado valor

### API Endpoints

- `GET /api/delivery-settings` - Buscar configurações
- `POST /api/delivery-settings` - Criar configurações
- `PUT /api/delivery-settings` - Atualizar configurações
- `DELETE /api/delivery-settings` - Deletar configurações

### Interface Admin

- **Rota**: `/admin/entregas`
- **Funcionalidades**:
  - Cadastro do endereço da loja
  - Configuração de tipos de entrega
  - Definição de custos
  - Ativação/desativação de entregas
  - Opção de permitir retirada

## 3. Como Usar

1. Acesse `/admin/entregas`
2. Configure o endereço da loja
3. Escolha o tipo de entrega
4. Defina os valores conforme o tipo escolhido
5. Marque se permite retirada
6. Ative as configurações
7. Salve

## 4. Integração com Checkout

As configurações podem ser consultadas na API e usadas no processo de checkout para calcular o valor do frete baseado na distância do cliente até a loja.

## 5. Exemplo de Cálculo de Frete

```typescript
// Exemplo de função para calcular frete
function calculateDeliveryFee(
  settings: DeliverySettings,
  distanceInKm: number,
  orderTotal: number
): number {
  switch (settings.deliveryType) {
    case 'FIXED':
      return settings.fixedCost;
    
    case 'VARIABLE':
      return distanceInKm * settings.costPerKm;
    
    case 'FIXED_PLUS_KM':
      return settings.fixedCost + (distanceInKm * settings.costPerKm);
    
    case 'FREE_ABOVE_VALUE':
      return orderTotal >= (settings.freeDeliveryMinValue || 0) ? 0 : settings.fixedCost;
    
    default:
      return 0;
  }
}
```
