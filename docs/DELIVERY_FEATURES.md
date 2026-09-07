# 🚚 Sistema de Entregas - Guia Completo

## ✨ Funcionalidades Implementadas

### 1. **Layout Padrão Admin** ✅
- Header com breadcrumb
- Menu lateral (AppSidebar)
- Footer
- Containers com alinhamento correto
- Responsivo e acessível

### 2. **Busca Automática de CEP** ✅
- Integração com API ViaCEP (gratuita)
- Autopreenchimento de:
  - Rua
  - Bairro
  - Cidade
  - Estado
- Máscara automática no campo CEP (00000-000)
- Feedback visual durante busca
- Tratamento de erros

### 3. **Interface Intuitiva** ✅

#### Modo Visualização
- Cards organizados
- Informações destacadas
- Status com badges coloridos
- Botão "Editar Configurações"

#### Modo Edição
- Formulário em seções
- CEP com busca automática ao completar 8 dígitos
- Campos condicionais baseados no tipo de entrega
- Validações em tempo real
- Botões de ação (Salvar/Cancelar)

## 🔧 Como Funciona

### Busca de CEP

```typescript
// Hook personalizado useViaCep
const { searchCep, formatCep, loading, error } = useViaCep();

// Ao digitar o CEP, aplica máscara
const handleCepChange = (e) => {
  const formatted = formatCep(e.target.value); // 12345678 → 12345-678
  setFormData({ ...formData, storeZipCode: formatted });
  
  // Quando completo (8 dígitos), busca automaticamente
  if (formatted.replace(/\D/g, '').length === 8) {
    const data = await searchCep(formatted);
    // Preenche automaticamente os campos
  }
};
```

### Máscara de CEP

- **Entrada**: `12345678`
- **Exibição**: `12345-678`
- **Validação**: Exatamente 8 dígitos numéricos

## 📋 Campos do Formulário

### Endereço da Loja
| Campo | Tipo | Obrigatório | Recurso |
|-------|------|-------------|---------|
| CEP | Text (máscara) | ✅ Sim | Busca automática |
| Rua | Text | ✅ Sim | Autopreenchido via CEP |
| Número | Text | ✅ Sim | - |
| Complemento | Text | ❌ Não | - |
| Bairro | Text | ✅ Sim | Autopreenchido via CEP |
| Cidade | Text | ✅ Sim | Autopreenchido via CEP |
| Estado | Text (2 letras) | ✅ Sim | Autopreenchido via CEP |

### Configuração de Entrega
| Campo | Condição | Validação |
|-------|----------|-----------|
| Tipo de Entrega | Sempre | Obrigatório |
| Custo Fixo | Se FIXED ou FIXED_PLUS_KM | R$ ≥ 0 |
| Custo por KM | Se VARIABLE ou FIXED_PLUS_KM | R$ ≥ 0 |
| Valor Mínimo Frete Grátis | Se FREE_ABOVE_VALUE | R$ ≥ 0 |
| Permite Retirada | Sempre | Checkbox |
| Ativo | Sempre | Checkbox |

## 🎨 Layout e Estrutura

### Hierarquia de Componentes
```
AdminLayout
├── AppHeader (automático via layout)
├── AppSidebar (automático via layout)
└── EntregasPage
    ├── Breadcrumb
    ├── Header (título + botão editar)
    └── Content
        ├── View Mode (cards)
        └── Edit Mode (formulário)
```

### Classes Tailwind Utilizadas
```css
/* Containers */
.rounded-lg         /* Bordas arredondadas */
.shadow-sm          /* Sombra suave */
.bg-white          /* Fundo branco */
.dark:bg-boxdark   /* Fundo escuro no dark mode */
.p-6               /* Padding interno */

/* Grid System */
.grid              /* Grid layout */
.gap-6             /* Espaçamento entre itens */
.md:grid-cols-2    /* 2 colunas em telas médias */

/* Inputs */
.border-stroke           /* Borda neutra */
.focus:border-primary    /* Borda azul ao focar */
.dark:border-strokedark  /* Borda escura no dark mode */
```

## 🚀 Fluxo de Uso

### Primeiro Acesso (Sem Configuração)
1. Usuário acessa `/admin/entregas`
2. Sistema detecta que não há configuração
3. Mostra formulário de criação automaticamente
4. Usuário preenche CEP → campos são autopreenchidos
5. Usuário completa os dados e salva
6. Sistema cria configuração e muda para modo visualização

### Edição de Configuração Existente
1. Usuário acessa `/admin/entregas`
2. Sistema mostra configuração em modo visualização
3. Usuário clica em "Editar Configurações"
4. Formulário aparece com dados preenchidos
5. Usuário altera o que desejar
6. Clica em "Salvar" ou "Cancelar"

## 🔍 API ViaCEP

### Endpoint
```
GET https://viacep.com.br/ws/{CEP}/json/
```

### Resposta de Sucesso
```json
{
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "complemento": "",
  "bairro": "Bela Vista",
  "localidade": "São Paulo",
  "uf": "SP",
  "ibge": "3550308",
  "gia": "1004",
  "ddd": "11",
  "siafi": "7107"
}
```

### Tratamento de Erros
```json
{
  "erro": true
}
```

## 📱 Responsividade

### Mobile (< 768px)
- 1 coluna
- Campos empilhados
- Botões em largura total

### Tablet (≥ 768px)
- 2 colunas
- Layout de grid
- Melhor aproveitamento do espaço

### Desktop (≥ 1024px)
- Layout completo
- Sidebar visível
- Máxima usabilidade

## ⚡ Performance

### Otimizações Implementadas
- ✅ Busca de CEP apenas quando completo (8 dígitos)
- ✅ Debounce implícito (só busca ao completar)
- ✅ Loading state durante busca
- ✅ Cache de resultados (via useState)
- ✅ Formatação de CEP em tempo real

## 🧪 Testando

### 1. Criar Nova Configuração
```bash
# Acesse
http://localhost:3000/admin/entregas

# Teste com CEP real
CEP: 01310-100 (Av. Paulista - SP)
CEP: 20040-020 (Centro - RJ)
CEP: 30130-100 (Centro - BH)
```

### 2. Testar Busca de CEP
- Digite um CEP válido
- Aguarde autopreenchimento
- Verifique se todos os campos foram preenchidos
- Campos editáveis mesmo após autopreenchimento

### 3. Testar Tipos de Entrega
- Altere entre os 4 tipos
- Verifique campos condicionais aparecendo/desaparecendo
- Valide cálculos de preço

## 🐛 Solução de Problemas

### CEP não encontrado
**Erro**: "CEP não encontrado"
**Solução**: Verifique se o CEP existe e tem 8 dígitos

### Campos não preenchidos automaticamente
**Erro**: Busca não funciona
**Causas Possíveis**:
1. CEP incompleto (< 8 dígitos)
2. Problema de conexão com ViaCEP
3. CEP inexistente

**Solução**: 
- Verifique conexão com internet
- Tente outro CEP
- Preencha manualmente se necessário

### Layout quebrado
**Erro**: Elementos desalinhados
**Solução**: 
- Limpe cache do navegador
- Verifique se Tailwind CSS está carregando
- Execute `npm run dev` novamente

## 📚 Arquivos Criados/Modificados

### Novos Arquivos
```
src/
├── hooks/
│   └── useViaCep.ts              # Hook para busca de CEP
└── app/(admin)/admin/entregas/
    └── page.tsx                  # Página completa com layout
```

### Arquivos Modificados
```
src/
└── layout/
    └── AppSidebar.tsx            # Adicionado menu "Entregas"
```

## ✅ Checklist de Implementação

- [x] Layout padrão admin aplicado
- [x] Breadcrumb implementado
- [x] Header com botão de edição
- [x] Containers com alinhamento correto
- [x] Busca automática de CEP
- [x] Máscara de CEP (00000-000)
- [x] Autopreenchimento de endereço
- [x] Tratamento de erros
- [x] Loading states
- [x] Modo visualização
- [x] Modo edição
- [x] Validações de formulário
- [x] Campos condicionais
- [x] Responsividade
- [x] Dark mode
- [x] Documentação

## 🎉 Pronto para Usar!

O sistema está completo com:
- ✅ Layout profissional
- ✅ Busca automática de CEP
- ✅ Máscaras nos campos
- ✅ Validações robustas
- ✅ Responsivo
- ✅ Acessível
- ✅ Documentado

**Próximo passo**: `npm run dev` e acesse `/admin/entregas`
