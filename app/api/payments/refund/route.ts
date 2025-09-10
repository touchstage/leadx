import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { razorpay } from '@/lib/razorpay'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { transactionId, reason, amount } = await request.json()

    if (!transactionId || !reason) {
      return NextResponse.json({ error: 'Transaction ID and reason are required' }, { status: 400 })
    }

    // Get transaction details
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        buyer: true,
        seller: true,
        intel: true
      }
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    if (transaction.buyerId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to refund this transaction' }, { status: 403 })
    }

    if (transaction.status !== 'RELEASED') {
      return NextResponse.json({ error: 'Transaction is not in released state' }, { status: 400 })
    }

    // Create refund with Razorpay
    const refundAmount = amount || transaction.creditsSpent
    const refund = await razorpay.payments.refund(transaction.id, {
      amount: refundAmount * 100, // Razorpay expects amount in paise
      notes: {
        reason: reason,
        transaction_id: transactionId,
        refunded_by: userId
      }
    })

    // Update transaction status
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'REFUNDED' }
    })

    // Update user credits
    await prisma.user.update({
      where: { id: user.id },
      data: {
        creditsBalance: {
          increment: refundAmount
        }
      }
    })

    // Create ledger entry
    await prisma.creditsLedger.create({
      data: {
        userId: user.id,
        type: 'REFUND',
        amount: refundAmount,
        balanceAfter: transaction.buyer.creditsBalance + refundAmount,
        referenceId: refund.id
      }
    })

    return NextResponse.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refundAmount,
        status: refund.status
      }
    })

  } catch (error) {
    console.error('Refund error:', error)
    return NextResponse.json({ error: 'Failed to process refund' }, { status: 500 })
  }
}
