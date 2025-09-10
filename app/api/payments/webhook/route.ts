import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const order = event.payload.order.entity;

      // Extract user ID and credits from order notes
      const userId = order.notes?.userId;
      const credits = parseInt(order.notes?.credits || '0');

      if (userId && credits > 0) {
        await prisma.$transaction(async (tx) => {
          // Update user credits
          await tx.user.update({
            where: { id: userId },
            data: { creditsBalance: { increment: credits } }
          });

          // Create ledger entry
          await tx.creditsLedger.create({
            data: {
              userId,
              type: 'PURCHASE',
              amount: credits,
              balanceAfter: 0, // Will be calculated
              referenceId: payment.id,
            },
          });
        });
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
