# 🔒 Guia de Segurança - Cardápio Digital

## ✅ Status de Segurança Atual

**Última verificação:** 14 de outubro de 2025  
**Status:** ✅ **SEGURO**

### Verificações Realizadas

- ✅ Nenhum CEP real exposto no código
- ✅ API Key do Google Maps protegida
- ✅ `.env.local` está no `.gitignore`
- ✅ Credenciais de banco não expostas
- ✅ Script de validação automática criado

## 🔐 Dados Sensíveis Protegidos

### 1. API Keys

#### Google Maps API Key
- **Localização:** `.env.local` (NÃO versionado)
- **Formato:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...`
- **Proteção:** 
  - ✅ Arquivo em `.gitignore`
  - ✅ Usado apenas server-side em `/api/calculate-distance`
  - ✅ Nunca exposto no frontend

**Verificar:**
```bash
# Garantir que .env.local não está no Git
git ls-files | grep .env.local  # Deve retornar vazio
```

### 2. Credenciais de Banco de Dados

#### DATABASE_URL
- **Localização:** `.env` e `.env.local`
- **Formato:** `postgresql://user:password@host:port/database`
- **Proteção:**
  - ✅ Arquivos `.env*` no `.gitignore`
  - ✅ Nunca commitados no repositório

**Exemplo SEGURO (documentação):**
```env
# ✅ Use variáveis genéricas em exemplos
DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

**Exemplo INSEGURO (NÃO FAZER):**
```env
# ❌ NUNCA exponha credenciais reais
DATABASE_URL="postgresql://postgres:minhasenha123@server.com:5432/cardapio"
```

### 3. Dados Pessoais (PII)

#### CEPs e Endereços
- **Risco:** Expor localização real do negócio
- **Proteção:**
  - ✅ Removidos todos os CEPs reais do código
  - ✅ Exemplos usam CEPs públicos (Av. Paulista, etc)
  - ⚠️ CEP real SOMENTE no banco de dados

**CEPs Seguros para Documentação:**
- `01310-100` - Av. Paulista, São Paulo (público)
- `20040-020` - Centro, Rio de Janeiro (público)
- `30130-100` - Centro, Belo Horizonte (público)

**CEPs a EVITAR em Código:**
- Qualquer CEP residencial ou comercial real

## 🛡️ Boas Práticas Implementadas

### 1. Arquivos de Ambiente

**`.gitignore` configurado:**
```
# local env files
.env
.env*.local
```

**Verificar antes de commitar:**
```bash
# Listar arquivos que serão commitados
git status

# Se .env.local aparecer, remover:
git reset HEAD .env.local
```

### 2. Variáveis de Ambiente

**✅ Correto - Server-side:**
```typescript
// Em API Routes (src/app/api/*)
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
```

**❌ Incorreto - Client-side exposto:**
```typescript
// NÃO FAZER - Expõe a key no browser
const apiKey = 'AIzaSyB...'; // Hard-coded
```

### 3. API Routes como Proxy

**Arquitetura Segura:**
```
Cliente → /api/calculate-distance → Google Maps API
         ↑ (API key protegida)
```

**Cliente nunca vê a API key:**
- ✅ Key lida do servidor
- ✅ Requisição feita server-side
- ✅ Apenas resultado retornado ao cliente

## 🔍 Script de Validação Automática

### Uso do `check-security.sh`

**Executar antes de commitar:**
```bash
./scripts/check-security.sh
```

**O que verifica:**
1. ✅ Arquivos `.env` não estão sendo commitados
2. ✅ API Keys não estão expostas
3. ⚠️ CEPs específicos (aviso)
4. ✅ Senhas/tokens não expostos
5. ✅ URLs de banco sem credenciais

**Exemplo de execução:**
```bash
🔍 Verificando segurança dos arquivos...

1️⃣  Verificando arquivos de ambiente...
✓ Nenhum arquivo .env sendo commitado

2️⃣  Verificando API Keys...
✓ Nenhuma API Key exposta

3️⃣  Verificando dados pessoais (CEPs)...
✓ Verificação de dados pessoais concluída

4️⃣  Verificando credenciais...
✓ Nenhuma credencial exposta

5️⃣  Verificando URLs de conexão...
✓ Nenhuma URL de banco exposta

✅ SEGURO PARA COMMITAR!
```

### Integrar com Git Hooks (Opcional)

**Criar `.git/hooks/pre-commit`:**
```bash
#!/bin/bash
./scripts/check-security.sh
```

**Tornar executável:**
```bash
chmod +x .git/hooks/pre-commit
```

Agora a validação roda automaticamente antes de cada commit!

## 📋 Checklist Antes de Commitar

- [ ] Executei `./scripts/check-security.sh`
- [ ] Nenhum arquivo `.env*` está sendo commitado
- [ ] Nenhuma API key está exposta
- [ ] CEPs são exemplos públicos (não reais)
- [ ] Senhas e tokens estão protegidos
- [ ] URLs de banco não contêm credenciais

## 🚨 O Que Fazer Se Expor Dados

### 1. Se API Key Foi Commitada

```bash
# 1. Invalidar a key imediatamente
# Acesse: https://console.cloud.google.com/
# Revogue a key antiga

# 2. Gerar nova key

# 3. Atualizar .env.local com nova key

# 4. Limpar histórico do Git (se necessário)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env.local' \
  --prune-empty --tag-name-filter cat -- --all
```

### 2. Se Credenciais Foram Expostas

```bash
# 1. Mudar senhas imediatamente
# 2. Atualizar .env com novas credenciais
# 3. Verificar logs de acesso do banco
# 4. Considerar limpar histórico do Git
```

### 3. Se Dados Pessoais Foram Expostos

```bash
# 1. Identificar o commit
git log --all --full-history -- "*.md"

# 2. Fazer rebase interativo para remover
git rebase -i <commit-hash>

# 3. Ou criar novo commit corrigindo
git commit -m "security: remove personal data"
```

## 🔐 Configurações de Segurança Recomendadas

### Google Maps API Key

**Restrições Recomendadas:**

1. **Restrições de API:**
   - ✅ Distance Matrix API
   - ❌ Todas as outras (desativadas)

2. **Restrições de Aplicativo:**
   - **Desenvolvimento:** `http://localhost:*/*`
   - **Produção:** `https://seudominio.com/*`

3. **Cotas:**
   - Definir limite diário (ex: 10.000 requisições/dia)
   - Alerta quando atingir 80% da quota

### PostgreSQL

**Configuração Segura:**

```sql
-- Criar usuário específico para a aplicação
CREATE USER cardapio_app WITH PASSWORD 'senha_forte_aqui';

-- Dar apenas permissões necessárias
GRANT CONNECT ON DATABASE cardapio TO cardapio_app;
GRANT USAGE ON SCHEMA public TO cardapio_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cardapio_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cardapio_app;
```

## 📊 Auditoria de Segurança

### Verificações Mensais

- [ ] Revisar acessos à API do Google Maps
- [ ] Verificar logs de banco de dados
- [ ] Atualizar dependências com vulnerabilidades
- [ ] Verificar se `.env.local` não foi commitado

### Comando de Auditoria

```bash
# Verificar se há .env no histórico
git log --all --full-history -- .env.local

# Verificar dependências com vulnerabilidades
npm audit

# Ver quem tem acesso ao repositório
git remote -v
```

## 🎓 Treinamento da Equipe

### Regras de Ouro

1. **NUNCA** commite arquivos `.env*`
2. **SEMPRE** use variáveis de ambiente para secrets
3. **EVITE** dados reais em exemplos/docs
4. **EXECUTE** `check-security.sh` antes de commitar
5. **REVISE** pull requests com foco em segurança

### Exemplos Práticos

**✅ BOM:**
```typescript
// Usar variável de ambiente
const apiKey = process.env.API_KEY;

// Exemplo em doc com dados genéricos
const cep = "01310-100"; // Av. Paulista - exemplo público
```

**❌ RUIM:**
```typescript
// Hard-coded
const apiKey = "AIzaSyB..."; 

```

## 📚 Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Google Cloud Security Best Practices](https://cloud.google.com/security/best-practices)

## ✅ Resumo de Segurança

| Item | Status | Proteção |
|------|--------|----------|
| API Key Google Maps | ✅ Segura | Server-side + .gitignore |
| DATABASE_URL | ✅ Segura | .env não versionado |
| CEPs Reais | ✅ Removidos | Apenas exemplos públicos |
| Senhas | ✅ Protegidas | Variáveis de ambiente |
| Script Validação | ✅ Ativo | check-security.sh |

---

**Última atualização:** 14 de outubro de 2025  
**Responsável:** Equipe de Desenvolvimento  
**Próxima revisão:** 14 de novembro de 2025
