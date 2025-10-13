# Sistema de Títulos de Página

## Configuração Global

O sistema está configurado para sempre ter um título padrão em todas as páginas através do `layout.tsx` principal:

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'Cardápio Digital | Sistema de Gestão de Restaurante',
    template: '%s | Cardápio Digital',
  },
  // ... outras configurações
};
```

## Como Adicionar Títulos em Páginas

### 1. Páginas Server-Side (sem "use client")

Use o export `metadata`:

```typescript
// src/app/admin/exemplo/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nome da Página',
  description: 'Descrição da página',
};

export default function ExemploPage() {
  return <div>Conteúdo</div>;
}
```

### 2. Páginas Client-Side (com "use client")

Use o hook `usePageTitle`:

```typescript
// src/app/admin/exemplo/page.tsx
'use client';

import { usePageTitle } from '@/hooks/usePageTitle';

export default function ExemploPage() {
  usePageTitle('Nome da Página');
  
  return <div>Conteúdo</div>;
}
```

## Páginas Já Configuradas

✅ **Layout Principal** - Título padrão global
✅ **Dashboard** - "Dashboard | Cardápio Digital"
✅ **Entregas** - "Configurações de Entrega | Cardápio Digital"
✅ **Pedidos** - "Pedidos | Cardápio Digital"
✅ **Reservas** - "Reservas | Cardápio Digital"
✅ **Produtos** - "Produtos | Cardápio Digital"

## Páginas a Configurar

Adicione títulos nas seguintes páginas quando trabalhá-las:

- [ ] /admin/catalogo/categorias
- [ ] /admin/catalogo/cardapios
- [ ] /admin/restaurante
- [ ] /admin/gerenciamento/usuarios
- [ ] /admin/gerenciamento/grupos
- [ ] /admin/gerenciamento/permissoes
- [ ] Todas as páginas de templates

## Hook usePageTitle

Localização: `src/hooks/usePageTitle.ts`

```typescript
import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Cardápio Digital`;
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
```

## Benefícios

1. **SEO**: Melhora a indexação nos motores de busca
2. **UX**: Usuário sabe em qual página está olhando a aba do navegador
3. **Navegação**: Facilita encontrar a aba correta quando há múltiplas abertas
4. **Profissionalismo**: Todos os sites profissionais têm títulos adequados

## Boas Práticas

- Use títulos descritivos e concisos
- Mantenha consistência no formato: "Nome da Página | Cardápio Digital"
- Evite títulos genéricos como "Página" ou "Admin"
- Para páginas de edição/criação, adicione contexto: "Editar Produto | Cardápio Digital"
- Para páginas com ID dinâmico, inclua informação relevante: "Pizza Margherita | Produtos | Cardápio Digital"

## Exemplo Completo com Página Dinâmica

```typescript
// src/app/admin/produtos/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState(null);
  
  // Título dinâmico baseado no produto carregado
  usePageTitle(product ? `Editar: ${product.name}` : 'Editar Produto');
  
  // ... resto do código
}
```
