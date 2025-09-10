const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createIntel() {
  try {
    console.log('📝 Creating intel entries...');
    
    // Get or create a user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'seller@example.com',
          name: 'Intel Seller',
          reputationScore: 4.8
        }
      });
      console.log('✅ Created user:', user.name);
    }
    
    // Create intel entries
    const intels = [
      {
        title: 'Docket CEO Contact Information',
        description: 'Direct contact details for Docket CEO including email, phone number, and LinkedIn profile. Verified through company website and professional networks.',
        priceCredits: 75,
        category: 'Contact Information'
      },
      {
        title: 'Connect with Docket CEO - Warm Introduction',
        description: 'I can provide a warm introduction to the CEO of Docket. We have worked together on several projects and I can facilitate a direct connection.',
        priceCredits: 100,
        category: 'Warm Introduction'
      },
      {
        title: 'Docket Company Intelligence Report',
        description: 'Comprehensive intelligence report on Docket including company size, funding status, key executives, recent news, and business strategy.',
        priceCredits: 150,
        category: 'Company Intelligence'
      },
      {
        title: 'SaaS VP Engineering Contacts',
        description: 'Curated list of VP Engineering contacts at mid-market SaaS companies (₹4-6 Cr ARR) with verified contact information.',
        priceCredits: 200,
        category: 'Contact Information'
      },
      {
        title: 'Fintech CRM Decision Makers',
        description: 'Database of CRM decision makers at fintech companies including CTOs, VPs of Sales, and Product Managers.',
        priceCredits: 120,
        category: 'Contact Information'
      }
    ];
    
    for (const intelData of intels) {
      const intel = await prisma.intel.create({
        data: {
          ...intelData,
          sellerId: user.id
        }
      });
      console.log('✅ Created:', intel.title);
    }
    
    console.log('🎉 Created', intels.length, 'new intel entries');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createIntel();
