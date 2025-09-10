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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDING";
    const my = searchParams.get("my");

    let whereClause: any = {
      status: status as any,
    };

    // If "my=true" parameter is provided, filter by requester (user's requests)
    if (my === "true") {
      whereClause.requesterId = user.id;
    } else {
      // Default: Get intel requests for the user's posted intel
      whereClause.sellerId = user.id;
    }

    const requests = await prisma.intelRequest.findMany({
      where: whereClause,
      include: {
        intel: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ requests });

  } catch (error) {
    console.error("Error fetching intel requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch intel requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
		if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { intelId, message, bountyCredits, deadline } = await req.json();

    if (!intelId || !message || !bountyCredits) {
      return NextResponse.json(
        { error: "Intel ID, message, and bounty credits are required" },
        { status: 400 }
      );
    }

    // Verify the intel exists and get the seller
    const intel = await prisma.intel.findUnique({
      where: { id: intelId },
      select: { id: true, sellerId: true, title: true },
    });

    if (!intel) {
      return NextResponse.json(
        { error: "Intel not found" },
        { status: 404 }
      );
    }

    // Don't allow users to request their own intel
    if (intel.sellerId === user.id) {
      return NextResponse.json(
        { error: "Cannot request details for your own intel" },
        { status: 400 }
      );
    }

    // Create the intel request
    const request = await prisma.intelRequest.create({
      data: {
        intelId,
        requesterId: user.id,
        sellerId: intel.sellerId,
        message,
        bountyCredits: parseInt(bountyCredits),
        deadline: deadline ? new Date(deadline) : null,
      },
      include: {
        intel: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
          },
        },
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
    });

    return NextResponse.json({ request });

  } catch (error) {
    console.error("Error creating intel request:", error);
    return NextResponse.json(
      { error: "Failed to create intel request" },
      { status: 500 }
    );
  }
}
