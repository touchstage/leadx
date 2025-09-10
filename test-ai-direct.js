const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAIDirect() {
  console.log('🧪 Testing AI filtering directly...');
  
  try {
    // Get sample results
    const intels = await prisma.intel.findMany({
      include: {
        seller: {
          select: {
            name: true,
            reputationScore: true
          }
        }
      },
      take: 3
    });
    
    const results = intels.map(intel => ({
      id: intel.id,
      type: "intel",
      title: intel.title,
      snippet: intel.description.substring(0, 300),
      sellerOrBuyerReputation: intel.seller.reputationScore,
      createdAt: intel.createdAt.toString(),
      score: 0.85
    }));
    
    console.log('Sample results:');
    results.forEach((r, i) => {
      console.log(`${i + 1}. ${r.title}`);
    });
    
    // Test AI filtering API endpoint
    const response = await fetch('http://localhost:3000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'hubspot ceo' })
    });
    
    const data = await response.json();
    console.log('\nSearch results:');
    data.intel.forEach((intel, i) => {
      console.log(`${i + 1}. ${intel.title}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testAIDirect();
