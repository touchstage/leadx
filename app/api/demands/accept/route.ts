import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	// Find user by Clerk ID
	const user = await prisma.user.findUnique({
		where: { clerkId: userId }
	});
	
	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	const { fulfillmentId, accept } = await req.json();
	const fulfillment = await prisma.demandFulfillment.findUnique({ where: { id: fulfillmentId }, include: { demand: true } });
	if (!fulfillment) return NextResponse.json({ error: "not found" }, { status: 404 });
	if (fulfillment.demand.buyerId !== user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });

	if (accept) {
		// create escrow transaction and mark accepted
		const platformFeeBps = Number(process.env.PLATFORM_FEE_BPS ?? 2000);
		const bounty = fulfillment.demand.bountyCredits;
		const fee = Math.floor((bounty * platformFeeBps) / 10000);
		const buyerId = fulfillment.demand.buyerId;
		const sellerId = fulfillment.sellerId;

		const result = await prisma.$transaction(async (tx) => {
			const buyer = await tx.user.findUnique({ where: { id: buyerId } });
			if (!buyer || buyer.creditsBalance < bounty) throw new Error("insufficient credits");
			await tx.user.update({ where: { id: buyerId }, data: { creditsBalance: { decrement: bounty } } });
			await tx.creditsLedger.create({
				data: { userId: buyerId, type: "SPEND", amount: bounty, balanceAfter: buyer.creditsBalance - bounty, referenceId: fulfillment.id },
			});
			const t = await tx.transaction.create({
				data: { buyerId, sellerId, demandId: fulfillment.demandId, creditsSpent: bounty, platformFee: fee, status: "ESCROW" },
			});
			await tx.demandFulfillment.update({ where: { id: fulfillment.id }, data: { status: "ACCEPTED" } });
			await tx.demand.update({ where: { id: fulfillment.demandId }, data: { status: "FULFILLED" } });
			return t;
		});
		return NextResponse.json({ transaction: result });
	}

	await prisma.demandFulfillment.update({ where: { id: fulfillment.id }, data: { status: "REJECTED" } });
	return NextResponse.json({ ok: true });
}


