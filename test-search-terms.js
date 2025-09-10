const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSearchTerms() {
  try {
    console.log('🔍 Testing Different Search Terms...\n');

    const testQueries = [
      "hubspot",
      "CFO", 
      "connect",
      "CEO",
      "Docket",
      "dollars",
      "Fintech",
      "UAE",
      "CRM",
      "SaaS",
      "Europe",
      "VP Sales",
      "Healthcare",
      "AI",
      "Real Estate",
      "PropTech",
      "E-commerce",
      "Supply Chain"
    ];

    for (const query of testQueries) {
      console.log(`\n🔎 Searching for: "${query}"`);
      
      const results = await prisma.$queryRaw`
        SELECT i.id, i.title, u.name as seller_name
        FROM "Intel" i
        JOIN "User" u ON u.id = i."sellerId"
        WHERE i.status = 'PUBLISHED'
        AND (
          LOWER(i.title) LIKE LOWER(${`%${query}%`}) OR
          LOWER(i.description) LIKE LOWER(${`%${query}%`}) OR
          LOWER(i.category) LIKE LOWER(${`%${query}%`})
        )
        ORDER BY i."createdAt" DESC
        LIMIT 5
      `;
      
      console.log(`Found ${results.length} results:`);
      results.forEach((result, index) => {
        console.log(`  ${index + 1}. "${result.title}" (${result.seller_name})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSearchTerms();
