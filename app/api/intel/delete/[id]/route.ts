import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
		if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const intelId = params.id;

    // Check if the intel exists and belongs to the user
    const intel = await prisma.intel.findUnique({
      where: { id: intelId },
      select: { id: true, sellerId: true, status: true }
    });

    if (!intel) {
      return NextResponse.json({ error: "Intel not found" }, { status: 404 });
    }

    if (intel.sellerId !== userId) {
      return NextResponse.json({ error: "Unauthorized to delete this intel" }, { status: 403 });
    }

    // Check if intel has been sold (can't delete sold intel)
    if (intel.status === 'SOLD') {
      return NextResponse.json({ error: "Cannot delete sold intel" }, { status: 400 });
    }

    // Delete the intel
    await prisma.intel.delete({
      where: { id: intelId }
    });

    return NextResponse.json({ message: "Intel deleted successfully" });

  } catch (error) {
    console.error("Error deleting intel:", error);
    return NextResponse.json(
      { error: "Failed to delete intel" },
      { status: 500 }
    );
  }
}
