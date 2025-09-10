// Test script to add sample intel requests
// Run with: node test-intel-requests.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleIntelRequests() {
  try {
    // First, get an existing intel and user
    const intel = await prisma.intel.findFirst();
    const user = await prisma.user.findFirst({
      where: {
        id: {
          not: intel?.sellerId
        }
      }
    });

    if (!intel || !user) {
      console.log('❌ Need at least one intel and one different user to create requests');
      return;
    }

    // Create sample intel requests
    const requests = [
      {
        intelId: intel.id,
        requesterId: user.id,
        sellerId: intel.sellerId,
        message: "I need more details about the specific CRM platforms they're evaluating and their decision timeline. Can you provide contact information for the decision makers?",
        bountyCredits: 200,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      },
      {
        intelId: intel.id,
        requesterId: user.id,
        sellerId: intel.sellerId,
        message: "Do you have information about their salary ranges and specific requirements? Also interested in companies that might be open to remote candidates.",
        bountyCredits: 150,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      }
    ];

    for (const requestData of requests) {
      const request = await prisma.intelRequest.create({
        data: requestData,
        include: {
          intel: true,
          requester: true,
        }
      });
      console.log('✅ Created intel request:', request.id);
    }

    console.log('🎉 Sample intel requests created successfully!');
  } catch (error) {
    console.error('❌ Error creating sample intel requests:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleIntelRequests();
