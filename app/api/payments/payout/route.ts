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

    const { amount, accountDetails } = await request.json()

    if (!amount || !accountDetails) {
      return NextResponse.json({ error: 'Amount and account details are required' }, { status: 400 })
    }

    if (user.creditsBalance < amount) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 })
    }

    // Create payout with Razorpay
    const payout = await razorpay.payouts.create({
      account_number: accountDetails.accountNumber,
      fund_account: {
        account_type: accountDetails.accountType,
        bank_account: {
          name: accountDetails.accountHolderName,
          ifsc: accountDetails.ifscCode,
          account_number: accountDetails.accountNumber
        }
      },
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      mode: 'IMPS',
      purpose: 'payout',
      queue_if_low_balance: true,
      reference_id: `payout_${userId}_${Date.now()}`,
      narration: 'LeadX Intel Earnings Payout'
    })

    // Update user credits
    await prisma.user.update({
      where: { id: userId },
      data: {
        creditsBalance: {
          decrement: amount
        }
      }
    })

    // Create ledger entry
    await prisma.creditsLedger.create({
      data: {
        userId: userId,
        type: 'CASHOUT',
        amount: -amount,
        balanceAfter: user.creditsBalance - amount,
        referenceId: payout.id
      }
    })

    return NextResponse.json({
      success: true,
      payout: {
        id: payout.id,
        amount: amount,
        status: payout.status,
        referenceId: payout.reference_id
      }
    })

  } catch (error) {
    console.error('Payout error:', error)
    return NextResponse.json({ error: 'Failed to process payout' }, { status: 500 })
  }
}
