// Test GPT model directly
const { openai, GPT_DEPLOYMENT } = require('./lib/ai/azure');

async function testGPT() {
  console.log('🧪 Testing GPT model directly...');
  
  try {
    const response = await openai.chat.completions.create({
      model: GPT_DEPLOYMENT,
      messages: [
        { role: "system", content: "You are a helpful assistant. Return only the word 'test' if you understand." },
        { role: "user", content: "Hello" },
      ],
      temperature: 0.1,
    });
    
    console.log('GPT Response:', response.choices[0]?.message?.content);
    console.log('✅ GPT model is working');
    
  } catch (error) {
    console.error('❌ GPT model error:', error.message);
  }
}

testGPT();
