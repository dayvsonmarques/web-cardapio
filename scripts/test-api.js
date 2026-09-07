// Teste da API delivery-settings
const fetch = require('node-fetch');

async function testAPI() {
  console.log('🧪 Testando API /api/delivery-settings...\n');

  try {
    const response = await fetch('http://localhost:3001/api/delivery-settings');
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ API funcionando!');
      console.log('\nDados retornados:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const error = await response.text();
      console.log('\n❌ Erro na API:');
      console.log(error);
    }
  } catch (error) {
    console.error('❌ Erro ao chamar API:', error.message);
    console.log('\n💡 Certifique-se de que o servidor está rodando:');
    console.log('   npm run dev\n');
  }
}

testAPI();
