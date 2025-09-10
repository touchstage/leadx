import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const demandId = params.id;

    // Find the demand and verify ownership
    const demand = await prisma.demand.findUnique({
      where: { id: demandId },
      include: { buyer: true }
    });

    if (!demand) {
      return NextResponse.json({ error: "Demand not found" }, { status: 404 });
    }

    // Check if the current user is the buyer
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user || user.id !== demand.buyerId) {
      return NextResponse.json({ error: "Unauthorized to cancel this demand" }, { status: 403 });
    }

    // Only allow cancellation if demand is still open
    if (demand.status !== 'OPEN') {
      return NextResponse.json({ error: "Cannot cancel a demand that is not open" }, { status: 400 });
    }

    // Update the demand status to cancelled
    const updatedDemand = await prisma.demand.update({
      where: { id: demandId },
      data: { status: 'CANCELLED' }
    });

    return NextResponse.json({ 
      message: "Demand cancelled successfully",
      demand: updatedDemand 
    });

  } catch (error) {
    console.error("Error cancelling demand:", error);
    return NextResponse.json(
      { error: "Failed to cancel demand" },
      { status: 500 }
    );
  }
}
