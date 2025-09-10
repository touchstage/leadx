const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTestData() {
  console.log('🌱 Seeding test data for RAG and intelligent search...');

  try {
    // Create test users
    const user1 = await prisma.user.upsert({
      where: { email: 'testuser1@example.com' },
      update: {},
      create: {
        email: 'testuser1@example.com',
        name: 'John Sales',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        creditsBalance: 1000,
        kycVerified: true,
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: 'testuser2@example.com' },
      update: {},
      create: {
        email: 'testuser2@example.com',
        name: 'Sarah Marketing',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        creditsBalance: 500,
        kycVerified: true,
      },
    });

    console.log('✅ Created test users');

    // Create test intel with diverse content for RAG testing
    const intelData = [
      {
        title: 'Fintech Companies in UAE Looking for CRM Solutions',
        description: 'Multiple fintech companies in Dubai and Abu Dhabi are actively seeking CRM solutions to manage their customer relationships. These companies are in the growth phase and need scalable solutions that can handle high transaction volumes. Key decision makers include CTOs and Head of Operations.',
        category: 'TECHNOLOGY',
        priceCredits: 200,
        status: 'PUBLISHED',
        sellerId: user1.id,
      },
      {
        title: 'B2B SaaS Companies Hiring VP Sales in Europe',
        description: 'Several B2B SaaS companies across Europe are actively recruiting VP of Sales positions. These companies are Series A to Series C stage and looking for experienced sales leaders who can scale their go-to-market operations. Remote work options available.',
        category: 'HIRING',
        priceCredits: 300,
        status: 'PUBLISHED',
        sellerId: user2.id,
      },
      {
        title: 'Healthcare Technology Companies Seeking AI Integration Partners',
        description: 'Healthcare technology companies in North America are looking for AI integration partners to enhance their patient care systems. These companies need expertise in machine learning, natural language processing, and predictive analytics for healthcare applications.',
        category: 'TECHNOLOGY',
        priceCredits: 400,
        status: 'PUBLISHED',
        sellerId: user1.id,
      },
      {
        title: 'E-commerce Companies Looking for Supply Chain Optimization',
        description: 'E-commerce companies are seeking supply chain optimization solutions to improve their logistics and reduce costs. These companies need expertise in inventory management, demand forecasting, and last-mile delivery optimization.',
        category: 'OPERATIONS',
        priceCredits: 250,
        status: 'PUBLISHED',
        sellerId: user2.id,
      },
      {
        title: 'Real Estate Companies Seeking PropTech Solutions',
        description: 'Real estate companies are actively looking for PropTech solutions to digitize their operations. These companies need property management software, virtual tour platforms, and customer relationship management systems specifically designed for real estate.',
        category: 'TECHNOLOGY',
        priceCredits: 350,
        status: 'PUBLISHED',
        sellerId: user1.id,
      },
    ];

    const createdIntels = [];
    for (const intel of intelData) {
      const createdIntel = await prisma.intel.create({
        data: intel,
      });
      createdIntels.push(createdIntel);
    }

    console.log('✅ Created test intel listings');

    // Create test demands
    const demandData = [
      {
        title: 'Need CRM Solutions for Fintech Startup',
        description: 'Looking for CRM solutions specifically designed for fintech companies. Need features for customer onboarding, compliance tracking, and transaction management.',
        category: 'TECHNOLOGY',
        bountyCredits: 150,
        status: 'OPEN',
        buyerId: user2.id,
      },
      {
        title: 'Seeking VP Sales for B2B SaaS Company',
        description: 'Looking for experienced VP of Sales to lead our go-to-market strategy. Must have experience in B2B SaaS sales and team building.',
        category: 'HIRING',
        bountyCredits: 200,
        status: 'OPEN',
        buyerId: user1.id,
      },
    ];

    for (const demand of demandData) {
      await prisma.demand.create({
        data: demand,
      });
    }

    console.log('✅ Created test demands');

    // Create some ratings
    const ratingData = [
      {
        stars: 5,
        comment: 'Excellent intel, very detailed and accurate',
        intelId: createdIntels[0].id,
        buyerId: user2.id,
        sellerId: user1.id,
      },
      {
        stars: 4,
        comment: 'Good information, helped with our research',
        intelId: createdIntels[1].id,
        buyerId: user1.id,
        sellerId: user2.id,
      },
      {
        stars: 5,
        comment: 'Outstanding quality, highly recommended',
        intelId: createdIntels[2].id,
        buyerId: user2.id,
        sellerId: user1.id,
      },
    ];

    for (const rating of ratingData) {
      await prisma.rating.create({
        data: rating,
      });
    }

    console.log('✅ Created test ratings');

    console.log('\n🎉 Test data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: 2`);
    console.log(`- Intel listings: ${intelData.length}`);
    console.log(`- Demands: ${demandData.length}`);
    console.log(`- Ratings: ${ratingData.length}`);

  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedTestData();
