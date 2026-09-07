#!/bin/bash

# Script para configurar o sistema de entregas

echo "🚀 Configurando Sistema de Entregas..."
echo ""

# 1. Gerar cliente Prisma atualizado
echo "📦 Gerando cliente Prisma..."
npx prisma generate

# 2. Criar e aplicar migration
echo "🔄 Criando migration..."
npx prisma migrate dev --name add-delivery-settings

# 3. Verificar se deu certo
echo ""
echo "✅ Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse http://localhost:3000/admin"
echo "2. Será redirecionado para /admin/dashboard"
echo "3. Clique em 'Entregas' no menu lateral"
echo "4. Configure o endereço da loja e opções de entrega"
echo ""
echo "📚 Documentação: docs/DELIVERY_SETUP.md"
