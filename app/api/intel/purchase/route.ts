import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const { intelId } = await req.json();
	const intel = await prisma.intel.findUnique({ where: { id: intelId } });
	if (!intel) return NextResponse.json({ error: "intel not found" }, { status: 404 });

	const buyerId = user.id as string;
	const platformFeeBps = Number(process.env.PLATFORM_FEE_BPS ?? 2000);
	const fee = Math.floor((intel.priceCredits * platformFeeBps) / 10000);

	const result = await prisma.$transaction(async (tx) => {
		const buyer = await tx.user.findUnique({ where: { id: buyerId } });
		if (!buyer || buyer.creditsBalance < intel.priceCredits) {
			throw new Error("insufficient credits");
		}

		await tx.user.update({
			where: { id: buyerId },
			data: { creditsBalance: { decrement: intel.priceCredits } },
		});

		await tx.creditsLedger.create({
			data: {
				userId: buyerId,
				type: "SPEND",
				amount: intel.priceCredits,
				balanceAfter: buyer.creditsBalance - intel.priceCredits,
				referenceId: intel.id,
			},
		});

		const txRow = await tx.transaction.create({
			data: {
				buyerId,
				sellerId: intel.sellerId,
				intelId: intel.id,
				creditsSpent: intel.priceCredits,
				platformFee: fee,
				status: "ESCROW",
			},
		});

		return txRow;
	});

	return NextResponse.json({ transaction: result });
}


