import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const { transactionId, action } = await req.json(); // action: 'release' | 'refund'
	const buyerId = user.id as string;

	const txRow = await prisma.transaction.findUnique({ where: { id: transactionId } });
	if (!txRow || txRow.buyerId !== buyerId) {
		return NextResponse.json({ error: "not found" }, { status: 404 });
	}
	if (txRow.status !== "ESCROW") {
		return NextResponse.json({ error: "invalid status" }, { status: 400 });
	}

	const result = await prisma.$transaction(async (tx) => {
		if (action === "release") {
			const seller = await tx.user.findUnique({ where: { id: txRow.sellerId } });
			if (!seller) throw new Error("seller not found");

			const sellerPayout = txRow.creditsSpent - txRow.platformFee;
			await tx.user.update({
				where: { id: txRow.sellerId },
				data: { creditsBalance: { increment: sellerPayout } },
			});
			await tx.creditsLedger.create({
				data: {
					userId: txRow.sellerId,
					type: "EARN",
					amount: sellerPayout,
					balanceAfter: seller.creditsBalance + sellerPayout,
					referenceId: txRow.id,
				},
			});

			return tx.transaction.update({ where: { id: txRow.id }, data: { status: "RELEASED" } });
		}

		if (action === "refund") {
			const buyer = await tx.user.findUnique({ where: { id: buyerId } });
			if (!buyer) throw new Error("buyer not found");
			await tx.user.update({
				where: { id: buyerId },
				data: { creditsBalance: { increment: txRow.creditsSpent } },
			});
			await tx.creditsLedger.create({
				data: {
					userId: buyerId,
					type: "REFUND",
					amount: txRow.creditsSpent,
					balanceAfter: buyer.creditsBalance + txRow.creditsSpent,
					referenceId: txRow.id,
				},
			});
			return tx.transaction.update({ where: { id: txRow.id }, data: { status: "REFUNDED" } });
		}

		throw new Error("invalid action");
	});

	return NextResponse.json({ transaction: result });
}


