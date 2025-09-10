import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { razorpay, RAZORPAY_CONFIG } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
		if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    if (!razorpay) {
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    const { amount, currency = 'INR', description = 'LeadX Credits' } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Amount must be at least 1" },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId,
        description,
        credits: amount * 100, // 1 INR = 100 credits
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_CONFIG.key_id,
    });

  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
