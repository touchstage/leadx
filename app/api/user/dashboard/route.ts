import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    
    // Check if user is authenticated
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

    // Get user's basic stats
    const userStats = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        creditsBalance: true,
        reputationScore: true,
        createdAt: true
      }
    });

    if (!userStats) {
      return NextResponse.json({ error: "User stats not found" }, { status: 404 });
    }

    // Get user's intel count
    const intelCount = await prisma.intel.count({
      where: { sellerId: user.id }
    });

    // Get user's demands count
    const demandsCount = await prisma.demand.count({
      where: { buyerId: user.id }
    });

    // Get total earnings from sales
    const totalEarnings = await prisma.transaction.aggregate({
      where: { 
        sellerId: user.id,
        status: 'RELEASED'
      },
      _sum: {
        creditsSpent: true
      }
    });

    // Get total spent on purchases
    const totalSpent = await prisma.transaction.aggregate({
      where: { 
        buyerId: user.id,
        status: 'RELEASED'
      },
      _sum: {
        creditsSpent: true
      }
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await prisma.transaction.count({
      where: {
        OR: [
          { buyerId: user.id },
          { sellerId: user.id }
        ],
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Get monthly earnings for the last 6 months
    const monthlyEarnings = [];
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const monthlyEarning = await prisma.transaction.aggregate({
        where: {
          sellerId: user.id,
          status: 'RELEASED',
          createdAt: {
            gte: startDate,
            lt: endDate
          }
        },
        _sum: {
          creditsSpent: true
        }
      });

      monthlyEarnings.push({
        month: startDate.toLocaleDateString('en-US', { month: 'short' }),
        earnings: monthlyEarning._sum.creditsSpent || 0
      });
    }

    // Get top performing intel
    const topIntel = await prisma.intel.findMany({
      where: { sellerId: user.id },
      include: {
        transactions: {
          where: { status: 'RELEASED' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const topPerformingIntel = topIntel.map(intel => ({
      id: intel.id,
      title: intel.title,
      sales: intel.transactions.length,
      revenue: intel.transactions.reduce((sum, t) => sum + t.creditsSpent, 0)
    }));
    return NextResponse.json({
      stats: {
        creditsBalance: userStats.creditsBalance,
        reputationScore: userStats.reputationScore,
        intelCount,
        demandsCount,
        totalEarnings: totalEarnings._sum.creditsSpent || 0,
        totalSpent: totalSpent._sum.creditsSpent || 0,
        recentActivity,
        memberSince: userStats.createdAt.toISOString().split('T')[0]
      },
      monthlyEarnings,
      topPerformingIntel
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
