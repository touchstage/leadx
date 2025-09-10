const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRAGSystem() {
  try {
    console.log('🧠 Testing RAG System Integration...\n');

    // 1. Check if we have embeddings in the database
    console.log('📊 Checking Embeddings Table:');
    const embeddings = await prisma.embedding.findMany({
      select: {
        id: true,
        intelId: true,
        demandId: true,
        metadata: true,
        createdAt: true
      },
      take: 5
    });
    
    console.log(`Found ${embeddings.length} embeddings:`);
    embeddings.forEach((embedding, index) => {
      console.log(`${index + 1}. Intel: ${embedding.intelId || 'N/A'}, Demand: ${embedding.demandId || 'N/A'}`);
    });

    // 2. Check intel with embeddings
    console.log('\n📋 Intel with Embeddings:');
    const intelWithEmbeddings = await prisma.intel.findMany({
      where: {
        status: 'PUBLISHED',
        embedding: {
          isNot: null
        }
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        createdAt: true
      },
      take: 5
    });
    
    console.log(`Found ${intelWithEmbeddings.length} intel with embeddings:`);
    intelWithEmbeddings.forEach((intel, index) => {
      console.log(`${index + 1}. "${intel.title}" (${intel.category})`);
    });

    // 3. Check demands with embeddings
    console.log('\n📋 Demands with Embeddings:');
    const demandsWithEmbeddings = await prisma.demand.findMany({
      where: {
        status: 'OPEN',
        embedding: {
          isNot: null
        }
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        createdAt: true
      },
      take: 5
    });
    
    console.log(`Found ${demandsWithEmbeddings.length} demands with embeddings:`);
    demandsWithEmbeddings.forEach((demand, index) => {
      console.log(`${index + 1}. "${demand.title}" (${demand.category})`);
    });

    // 4. Test search API endpoint
    console.log('\n🔍 Testing Search API Endpoint:');
    const testQueries = [
      "hubspot",
      "CFO",
      "connect",
      "Fintech",
      "SaaS",
      "AI integration"
    ];

    for (const query of testQueries) {
      try {
        console.log(`\n🔎 Testing search for: "${query}"`);
        
        const response = await fetch('http://localhost:3000/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query })
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Found ${data.intel.length} results (${data.searchType} search)`);
          if (data.aiAnswer) {
            console.log(`🤖 AI Answer: ${data.aiAnswer.substring(0, 100)}...`);
          }
        } else {
          console.log(`❌ Search failed: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ Error testing search: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRAGSystem();
