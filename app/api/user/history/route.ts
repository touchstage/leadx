import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
		if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's demands (requests)
    const demands = await prisma.demand.findMany({
      where: { buyerId: user.id },
      include: {
        fulfillments: {
          include: {
            seller: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    // Get user's intel purchases
    const purchases = await prisma.transaction.findMany({
      where: { 
        buyerId: user.id,
        intelId: { not: null }
      },
      include: {
        intel: {
          select: { id: true, title: true, description: true, createdAt: true }
        },
        seller: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    // Get user's intel sales
    const sales = await prisma.transaction.findMany({
      where: { 
        sellerId: user.id,
        intelId: { not: null }
      },
      include: {
        intel: {
          select: { id: true, title: true, description: true, createdAt: true }
        },
        buyer: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    // Transform demands to match frontend format
    const transformedDemands = demands.map(demand => ({
      id: demand.id,
      title: demand.title,
      status: demand.status.toLowerCase(),
      bounty: demand.bountyCredits,
      date: demand.createdAt.toISOString().split('T')[0],
      deadline: demand.deadline ? new Date(Date.now() + demand.deadline * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      fulfillment: demand.fulfillments.find(f => f.status === 'ACCEPTED') ? {
        seller: demand.fulfillments.find(f => f.status === 'ACCEPTED')?.seller.name || 'Unknown',
        intel: demand.fulfillments.find(f => f.status === 'ACCEPTED')?.content || '',
        rating: 5 // Default rating, you might want to add actual ratings
      } : null
    }));

    // Transform purchases to match frontend format
    const transformedPurchases = purchases.map(purchase => ({
      id: purchase.id,
      title: purchase.intel?.title || 'Unknown Intel',
      seller: purchase.seller?.name || purchase.seller?.email || 'Unknown Seller',
      price: purchase.creditsSpent,
      date: purchase.createdAt.toISOString().split('T')[0],
      status: purchase.status.toLowerCase(),
      rating: 5 // Default rating, you might want to add actual ratings
    }));

    // Transform sales to match frontend format
    const transformedSales = sales.map(sale => ({
      id: sale.id,
      title: sale.intel?.title || 'Unknown Intel',
      buyer: sale.buyer?.name || sale.buyer?.email || 'Unknown Buyer',
      price: sale.creditsSpent,
      date: sale.createdAt.toISOString().split('T')[0],
      status: sale.status.toLowerCase(),
      rating: 5 // Default rating, you might want to add actual ratings
    }));

    return NextResponse.json({
      requests: transformedDemands,
      purchases: transformedPurchases,
      sales: transformedSales
    });

  } catch (error) {
    console.error("Error fetching user history:", error);
    return NextResponse.json(
      { error: "Failed to fetch user history" },
      { status: 500 }
    );
  }
}
