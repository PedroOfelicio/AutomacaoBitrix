const axios = require('axios');

// URL da API do Bitrix24
const API_URL = 'https://b24-3lnvx7.bitrix24.com.br/';

// Função para fazer uma solicitação GET para a página inicial do Bitrix24
async function testConnection() {
  try {
    const response = await axios.get(API_URL);
    console.log('Conexão bem-sucedida!');
  } catch (error) {
    console.error('Erro ao conectar:', error.message);
  }
}

// Executar a função para testar a conexão
testConnection();
