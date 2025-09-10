import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
		if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { requestId, response } = await req.json();

    if (!requestId || !response) {
      return NextResponse.json(
        { error: "Request ID and response are required" },
        { status: 400 }
      );
    }

    // Verify the request exists and belongs to the user
    const intelRequest = await prisma.intelRequest.findUnique({
      where: { id: requestId },
      include: {
        requester: true,
        seller: true,
      },
    });

    if (!intelRequest) {
      return NextResponse.json(
        { error: "Intel request not found" },
        { status: 404 }
      );
    }

    if (intelRequest.sellerId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to respond to this request" },
        { status: 403 }
      );
    }

    if (intelRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Request has already been responded to" },
        { status: 400 }
      );
    }

    // Update the request with the response
    const updatedRequest = await prisma.intelRequest.update({
      where: { id: requestId },
      data: {
        response,
        status: "RESPONDED",
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

    // TODO: Transfer credits from requester to seller
    // This would involve updating the credits ledger and user balances

    return NextResponse.json({ request: updatedRequest });

  } catch (error) {
    console.error("Error responding to intel request:", error);
    return NextResponse.json(
      { error: "Failed to respond to intel request" },
      { status: 500 }
    );
  }
}
