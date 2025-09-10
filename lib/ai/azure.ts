import OpenAI from "openai";

// Azure OpenAI configuration using standard OpenAI package
export const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments`,
  defaultQuery: { 'api-version': process.env.OPENAI_API_VERSION || "2024-02-15-preview" },
  defaultHeaders: {
    'api-key': process.env.AZURE_OPENAI_API_KEY!,
  },
});

// Use the deployment names from environment variables
export const EMBEDDINGS_DEPLOYMENT = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME!;
export const GPT_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT_NAME!;

// Test function to verify Azure OpenAI connection
export async function testAzureConnection() {
  try {
    console.log('🔧 Testing Azure OpenAI connection...');
    console.log('Endpoint:', process.env.AZURE_OPENAI_ENDPOINT);
    console.log('API Key:', process.env.AZURE_OPENAI_API_KEY ? 'Present' : 'Missing');
    console.log('Deployment:', process.env.AZURE_OPENAI_DEPLOYMENT_NAME);
    console.log('Embedding Deployment:', process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME);
    console.log('API Version:', process.env.OPENAI_API_VERSION);
    
    // Test embeddings
    const embeddingResponse = await openai.embeddings.create({
      model: EMBEDDINGS_DEPLOYMENT,
      input: "test",
    });
    
    console.log('✅ Embeddings API working, vector length:', embeddingResponse.data[0].embedding.length);
    return true;
  } catch (error) {
    console.error('❌ Azure OpenAI connection failed:', error);
    return false;
  }
}


