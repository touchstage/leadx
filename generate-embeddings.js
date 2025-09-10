const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function generateEmbeddings() {
  console.log('🔄 Generating embeddings for all intel...');
  
  try {
    // Get all intel without embeddings
    const intels = await prisma.intel.findMany({
      include: {
        embedding: true
      }
    });
    
    console.log(`Found ${intels.length} intel entries`);
    
    for (const intel of intels) {
      if (intel.embedding) {
        console.log(`⏭️  Skipping ${intel.title} (already has embedding)`);
        continue;
      }
      
      console.log(`🔄 Generating embedding for: ${intel.title}`);
      
      try {
        const response = await fetch('http://localhost:3000/api/embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: `${intel.title} ${intel.description}` 
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Store the embedding
          await prisma.embedding.create({
            data: {
              intelId: intel.id,
              vector: data.embedding,
              metadata: {
                title: intel.title,
                category: intel.category
              }
            }
          });
          console.log(`✅ Generated embedding for: ${intel.title}`);
        } else {
          console.error(`❌ Failed to generate embedding for ${intel.title}:`, data.error);
        }
      } catch (error) {
        console.error(`❌ Error generating embedding for ${intel.title}:`, error.message);
      }
    }
    
    console.log('🎉 Embedding generation complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

generateEmbeddings();
