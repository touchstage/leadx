import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const { credits } = await req.json();
	const amount = Math.max(0, Number(credits || 0));
	if (!amount) return NextResponse.json({ error: "invalid amount" }, { status: 400 });

	const userId = user.id as string;
	const result = await prisma.$transaction(async (tx) => {
		const user = await tx.user.findUnique({ where: { id: userId } });
		if (!user || user.creditsBalance < amount) throw new Error("insufficient credits");
		await tx.user.update({ where: { id: userId }, data: { creditsBalance: { decrement: amount } } });
		await tx.creditsLedger.create({ data: { userId, type: "CASHOUT", amount, balanceAfter: user.creditsBalance - amount } });
		return true;
	});

	return NextResponse.json({ ok: result });
}


