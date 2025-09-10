const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSearch() {
  try {
    console.log('🔍 Testing Search Functionality...\n');

    // 1. Check all intel in database
    console.log('📊 All Intel in Database:');
    const allIntel = await prisma.intel.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        sellerId: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${allIntel.length} intel entries:`);
    allIntel.forEach((intel, index) => {
      console.log(`${index + 1}. "${intel.title}" (Status: ${intel.status}, Seller: ${intel.sellerId})`);
    });

    // 2. Check published intel only
    console.log('\n📋 Published Intel Only:');
    const publishedIntel = await prisma.intel.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        sellerId: true
      }
    });
    
    console.log(`Found ${publishedIntel.length} published intel entries:`);
    publishedIntel.forEach((intel, index) => {
      console.log(`${index + 1}. "${intel.title}" (Seller: ${intel.sellerId})`);
    });

    // 3. Test search query
    const testQuery = "intel"; // Generic search term
    console.log(`\n🔎 Testing search for: "${testQuery}"`);
    
    const searchResults = await prisma.$queryRaw`
      SELECT i.*, u.name as seller_name
      FROM "Intel" i
      JOIN "User" u ON u.id = i."sellerId"
      WHERE i.status = 'PUBLISHED'
      AND (
        LOWER(i.title) LIKE LOWER(${`%${testQuery}%`}) OR
        LOWER(i.description) LIKE LOWER(${`%${testQuery}%`}) OR
        LOWER(i.category) LIKE LOWER(${`%${testQuery}%`})
      )
      ORDER BY i."createdAt" DESC
      LIMIT 10
    `;
    
    console.log(`Search returned ${searchResults.length} results:`);
    searchResults.forEach((result, index) => {
      console.log(`${index + 1}. "${result.title}" (Seller: ${result.seller_name})`);
    });

    // 4. Test with specific terms from your intel
    if (publishedIntel.length > 0) {
      const firstIntel = publishedIntel[0];
      const titleWords = firstIntel.title.split(' ').slice(0, 2); // First 2 words
      const testSpecificQuery = titleWords.join(' ');
      
      console.log(`\n🎯 Testing specific search for: "${testSpecificQuery}"`);
      
      const specificResults = await prisma.$queryRaw`
        SELECT i.*, u.name as seller_name
        FROM "Intel" i
        JOIN "User" u ON u.id = i."sellerId"
        WHERE i.status = 'PUBLISHED'
        AND (
          LOWER(i.title) LIKE LOWER(${`%${testSpecificQuery}%`}) OR
          LOWER(i.description) LIKE LOWER(${`%${testSpecificQuery}%`}) OR
          LOWER(i.category) LIKE LOWER(${`%${testSpecificQuery}%`})
        )
        ORDER BY i."createdAt" DESC
        LIMIT 10
      `;
      
      console.log(`Specific search returned ${specificResults.length} results:`);
      specificResults.forEach((result, index) => {
        console.log(`${index + 1}. "${result.title}" (Seller: ${result.seller_name})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSearch();
