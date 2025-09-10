import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
		if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const intelId = params.id;
    const { title, description, category, priceCredits, additionalDetails } = await request.json();

    // Check if the intel exists and belongs to the user
    const intel = await prisma.intel.findUnique({
      where: { id: intelId },
      select: { id: true, sellerId: true, status: true }
    });

    if (!intel) {
      return NextResponse.json({ error: "Intel not found" }, { status: 404 });
    }

    if (intel.sellerId !== userId) {
      return NextResponse.json({ error: "Unauthorized to update this intel" }, { status: 403 });
    }

    // Check if intel has been sold (can't edit sold intel)
    if (intel.status === 'SOLD') {
      return NextResponse.json({ error: "Cannot edit sold intel" }, { status: 400 });
    }

    // Update the intel
    const updatedIntel = await prisma.intel.update({
      where: { id: intelId },
      data: {
        title,
        description,
        category,
        priceCredits: parseInt(priceCredits),
        additionalDetails,
        updatedAt: new Date()
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        priceCredits: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ intel: updatedIntel });

  } catch (error) {
    console.error("Error updating intel:", error);
    return NextResponse.json(
      { error: "Failed to update intel" },
      { status: 500 }
    );
  }
}
