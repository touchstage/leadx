import { NextResponse } from "next/server";
import Stripe from "stripe";
export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const { amountUsd } = await req.json();
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

	const price = Math.max(1, Number(amountUsd));
	const credits = price * 100; // 1 USD = 100 credits (example)

	const sessionCheckout = await stripe.checkout.sessions.create({
		mode: "payment",
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: { name: `${credits} Credits` },
					unit_amount: price * 100,
				},
				quantity: 1,
			},
		],
		success_url: `${process.env.NEXTAUTH_URL}/wallet?status=success`,
		cancel_url: `${process.env.NEXTAUTH_URL}/wallet?status=cancelled`,
		metadata: { userId: user.id, credits: String(credits) },
	});

	return NextResponse.json({ url: sessionCheckout.url });
}


