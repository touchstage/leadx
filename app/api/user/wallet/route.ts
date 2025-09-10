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

    // Get user's current balance (already fetched above)
    const userBalance = user.creditsBalance;

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

    // Get recent transactions from credits ledger
    const recentTransactions = await prisma.creditsLedger.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    // Transform transactions to match frontend format
    const transformedTransactions = recentTransactions.map((transaction: any) => {
      let type = 'deposit';
      let amount = transaction.amount;
      let description = '';
      let status = 'completed';

      switch (transaction.type) {
        case 'PURCHASE':
          type = 'deposit';
          description = 'Credits purchased';
          break;
        case 'SPEND':
          type = 'purchase';
          amount = -amount;
          description = 'Intel purchase';
          break;
        case 'EARN':
          type = 'sale';
          description = 'Intel sale';
          break;
        case 'CASHOUT':
          type = 'withdrawal';
          amount = -amount;
          description = 'Cash out to bank account';
          status = 'pending'; // You might want to add a status field to the ledger
          break;
        case 'FEE':
          type = 'purchase';
          amount = -amount;
          description = 'Platform fee';
          break;
        case 'REFUND':
          type = 'deposit';
          description = 'Refund';
          break;
        default:
          description = 'Credit transaction';
      }

      return {
        id: transaction.id,
        type,
        amount,
        description,
        date: transaction.createdAt.toISOString().split('T')[0],
        status
      };
    });

    return NextResponse.json({
      currentBalance: userBalance,
      totalEarnings: totalEarnings._sum.creditsSpent || 0,
      totalSpent: totalSpent._sum.creditsSpent || 0,
      transactions: transformedTransactions
    });

  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet data" },
      { status: 500 }
    );
  }
}
