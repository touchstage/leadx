// Debug environment variables
console.log('🔍 Environment Variables Debug:');
console.log('AZURE_OPENAI_API_KEY:', process.env.AZURE_OPENAI_API_KEY ? 'Present' : 'Missing');
console.log('AZURE_OPENAI_ENDPOINT:', process.env.AZURE_OPENAI_ENDPOINT);
console.log('AZURE_OPENAI_DEPLOYMENT_NAME:', process.env.AZURE_OPENAI_DEPLOYMENT_NAME);
console.log('AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME:', process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME);
console.log('OPENAI_API_VERSION:', process.env.OPENAI_API_VERSION);

// Test the baseURL construction
const baseURL = `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments`;
console.log('Constructed baseURL:', baseURL);
