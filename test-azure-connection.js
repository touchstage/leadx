const { testAzureConnection } = require('./lib/ai/azure');

async function testConnection() {
  console.log('🧪 Testing Azure OpenAI Connection...\n');
  
  const isWorking = await testAzureConnection();
  
  if (isWorking) {
    console.log('\n🎉 Azure OpenAI is working correctly!');
  } else {
    console.log('\n❌ Azure OpenAI connection failed. Check your configuration.');
  }
}

testConnection().catch(console.error);
