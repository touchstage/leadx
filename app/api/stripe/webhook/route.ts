import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
	const rawBody = await req.text();
	const signature = (req.headers.get("stripe-signature") as string) ?? "";
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
	} catch (err: any) {
		return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object as Stripe.Checkout.Session;
		const userId = session.metadata?.userId as string | undefined;
		const credits = Number(session.metadata?.credits ?? 0);
		if (userId && credits > 0) {
			await prisma.$transaction(async (tx) => {
				const user = await tx.user.findUnique({ where: { id: userId } });
				if (!user) return;
				await tx.user.update({ where: { id: userId }, data: { creditsBalance: { increment: credits } } });
				await tx.creditsLedger.create({
					data: {
						userId,
						type: "PURCHASE",
						amount: credits,
						balanceAfter: user.creditsBalance + credits,
						referenceId: session.id,
					},
				});
			});
		}
	}

	return NextResponse.json({ received: true });
}


