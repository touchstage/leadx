const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRAGComplete() {
  try {
    console.log('🧠 Testing Complete RAG System...\n');

    // Test 1: Check if we have any embeddings
    console.log('📊 Checking existing embeddings...');
    const embeddings = await prisma.embedding.findMany({
      select: {
        id: true,
        intelId: true,
        demandId: true,
        createdAt: true
      },
      take: 5
    });
    
    console.log(`Found ${embeddings.length} embeddings in database`);

    // Test 2: Test search API with different queries
    const testQueries = [
      "hubspot CFO",
      "connect CEO",
      "Fintech CRM",
      "SaaS VP Sales",
      "AI integration healthcare"
    ];

    console.log('\n🔍 Testing Search API with RAG...');
    
    for (const query of testQueries) {
      try {
        console.log(`\n🔎 Testing: "${query}"`);
        
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
            console.log(`🤖 AI Answer: ${data.aiAnswer.substring(0, 150)}...`);
          } else {
            console.log(`📝 No AI answer generated`);
          }
          
          // Show first result
          if (data.intel.length > 0) {
            const firstResult = data.intel[0];
            console.log(`📋 First result: "${firstResult.title}" (Relevance: ${firstResult.relevance || 'N/A'}%)`);
          }
        } else {
          const error = await response.json();
          console.log(`❌ Search failed: ${error.error || error.details}`);
        }
      } catch (error) {
        console.log(`❌ Network error: ${error.message}`);
      }
    }

    // Test 3: Test embedding generation for new intel
    console.log('\n🔄 Testing embedding generation...');
    
    try {
      const response = await fetch('http://localhost:3000/api/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: "Test intel about SaaS companies looking for VP Sales" })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Embedding generated successfully! Vector length: ${data.embedding.length}`);
      } else {
        const error = await response.json();
        console.log(`❌ Embedding generation failed: ${error.details || error.error}`);
      }
    } catch (error) {
      console.log(`❌ Embedding test error: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRAGComplete();
