import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
		if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const demands = await prisma.demand.findMany({
      where: {
        buyerId: user.id
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        bountyCredits: true,
        status: true,
        deadline: true,
        createdAt: true,
        updatedAt: true
      },
      take: 50,
    });

    return NextResponse.json({ demands });
  } catch (error) {
    console.error("Error fetching user demands:", error);
    return NextResponse.json(
      { error: "Failed to fetch demands" },
      { status: 500 }
    );
  }
}
