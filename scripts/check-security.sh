#!/bin/bash

# 🔒 Script de Validação de Segurança
# Verifica se há dados sensíveis antes de fazer commit

echo "🔍 Verificando segurança dos arquivos..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# 1. Verificar se .env.local está sendo commitado
echo "1️⃣  Verificando arquivos de ambiente..."
if git diff --cached --name-only | grep -E "\.env\.local|\.env$"; then
    echo -e "${RED}❌ ERRO: Arquivos .env estão sendo commitados!${NC}"
    echo "   Remova com: git reset HEAD .env.local"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ Nenhum arquivo .env sendo commitado${NC}"
fi
echo ""

# 2. Verificar API Keys expostas
echo "2️⃣  Verificando API Keys..."
if git diff --cached | grep -iE "AIza[A-Za-z0-9_-]{35}"; then
    echo -e "${RED}❌ ERRO: API Key do Google Maps detectada!${NC}"
    echo "   Remova a key antes de commitar"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ Nenhuma API Key exposta${NC}"
fi
echo ""

# 3. Verificar CEPs específicos (dados reais)
echo "3️⃣  Verificando dados pessoais (CEPs)..."
if git diff --cached | grep -E "52[0-9]{3}-[0-9]{3}|52[0-9]{6}"; then
    echo -e "${YELLOW}⚠️  AVISO: CEP de Recife detectado${NC}"
    echo "   Verifique se não são dados reais"
    # Não incrementa ERRORS, apenas aviso
fi

if git diff --cached | grep -iE "Rua Primeiro de Janeiro|Casa Amarela"; then
    echo -e "${YELLOW}⚠️  AVISO: Endereço específico detectado${NC}"
    echo "   Verifique se não são dados reais"
fi

echo -e "${GREEN}✓ Verificação de dados pessoais concluída${NC}"
echo ""

# 4. Verificar senhas ou tokens
echo "4️⃣  Verificando credenciais..."
if git diff --cached | grep -iE "password['\"]?\s*[:=]\s*['\"]?[^'\"]{8,}|token['\"]?\s*[:=]"; then
    echo -e "${RED}❌ ERRO: Possível senha ou token detectado!${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ Nenhuma credencial exposta${NC}"
fi
echo ""

# 5. Verificar URLs de banco de dados
echo "5️⃣  Verificando URLs de conexão..."
if git diff --cached | grep -E "postgresql://[^/]+:[^@]+@"; then
    echo -e "${RED}❌ ERRO: URL de banco com credenciais detectada!${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ Nenhuma URL de banco exposta${NC}"
fi
echo ""

# Resultado final
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ SEGURO PARA COMMITAR!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ ENCONTRADOS $ERRORS ERRO(S) DE SEGURANÇA!${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "📝 Corrija os problemas antes de commitar"
    echo "   Para ignorar (NÃO RECOMENDADO): git commit --no-verify"
    exit 1
fi
