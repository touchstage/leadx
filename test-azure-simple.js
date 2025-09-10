// Simple test to verify Azure OpenAI connection
const https = require('https');

async function testAzureDirect() {
  try {
    console.log('🧪 Testing Azure OpenAI Direct Connection...\n');

    const endpoint = 'https://demo-super.openai.azure.com/openai/deployments/text-embedding-3-small/embeddings';
    const apiKey = 'your-azure-openai-api-key';
    const apiVersion = '2024-02-15-preview';

    const data = JSON.stringify({
      input: "test embedding"
    });

    const options = {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      }
    };

    console.log('🔗 Making direct API call...');
    console.log('Endpoint:', endpoint);
    console.log('API Version:', apiVersion);

    const response = await fetch(`${endpoint}?api-version=${apiVersion}`, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: data
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS!');
      console.log('Vector length:', result.data[0].embedding.length);
      console.log('Model:', result.model);
      console.log('Usage:', result.usage);
    } else {
      const error = await response.json();
      console.log('❌ FAILED:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAzureDirect();
