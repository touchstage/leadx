const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAIFiltering() {
  console.log('🧪 Testing AI Filtering...');
  
  try {
    // Get some sample results
    const intels = await prisma.intel.findMany({
      include: {
        seller: {
          select: {
            name: true,
            reputationScore: true
          }
        }
      },
      take: 5
    });
    
    console.log('Sample intel entries:');
    intels.forEach((intel, i) => {
      console.log(`${i + 1}. ${intel.title}`);
    });
    
    // Test the AI filtering API
    const response = await fetch('http://localhost:3000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'hubspot ceo' })
    });
    
    const data = await response.json();
    console.log('\nSearch results for "hubspot ceo":');
    data.intel.forEach((intel, i) => {
      console.log(`${i + 1}. ${intel.title}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAIFiltering();
