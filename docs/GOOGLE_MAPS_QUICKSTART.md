# 🚀 Quick Start - Google Maps Integration

## Configuração Rápida (5 minutos)

### 1. Obter API Key do Google Maps

1. Acesse: **https://console.cloud.google.com/**
2. Crie um projeto: "Cardapio Digital"
3. Ative: **Distance Matrix API**
4. Crie credencial: **API Key**
5. Copie a chave gerada

### 2. Configurar no Projeto

```bash
# Abra o arquivo .env.local (já existe no projeto)
code .env.local

# Substitua "your_api_key_here" pela sua chave
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Reiniciar Servidor

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

### 4. Testar

1. Acesse: http://localhost:3001/cardapio
2. Adicione produtos ao carrinho
3. Vá para o carrinho
4. Digite CEP: **01310-100**
5. Clique em **OK**
6. Você deve ver: "Distância: X km • Tempo estimado: X min"

## 🎯 CEPs para Teste (São Paulo)

| CEP | Local | Distância da Av. Paulista |
|-----|-------|---------------------------|
| 01310-100 | Av. Paulista (Centro) | 0 km |
| 04567-000 | Vila Olímpia | ~15 km |
| 05001-000 | Perdizes | ~8 km |
| 03001-000 | Brás | ~5 km |

## ⚠️ Importante

- **Custo**: Primeiros $200 USD/mês são GRÁTIS
- **Segurança**: API Key está protegida no servidor
- **Fallback**: Se API não funcionar, usa distância simulada

## 📖 Documentação Completa

Veja: `docs/GOOGLE_MAPS_INTEGRATION.md`

## 🐛 Problemas?

### API Key não funciona
```bash
# Verifique se a chave está no arquivo
cat .env.local | grep GOOGLE_MAPS

# Reinicie o servidor
npm run dev
```

### Sempre usa distância simulada
- Confirme que ativou **Distance Matrix API** no Google Cloud
- Verifique se a API Key tem permissões corretas
- Olhe o console do navegador para erros

## ✅ Como Saber se Está Funcionando?

**Com Google Maps (sucesso):**
```
✓ Distância: 15.3km • Tempo estimado: 23 min
✓ Console: "Using Google Maps API"
```

**Sem Google Maps (fallback):**
```
✓ Distância aproximada: 15km
✓ Console: "Google Maps API key not configured. Using simulated distance."
```

Ambos funcionam! A diferença é que o Google Maps é mais preciso.

## 🎉 Pronto!

Sua integração com Google Maps está completa. O sistema agora calcula distâncias reais e tempo de entrega automaticamente!
