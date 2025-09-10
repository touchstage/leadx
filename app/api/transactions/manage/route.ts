import { NextRequest, NextResponse } from 'next/server'


import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all' // 'bought', 'sold', 'all'

    let whereClause: any = {}

    if (type === 'bought') {
      whereClause.buyerId = userId
    } else if (type === 'sold') {
      whereClause.sellerId = userId
    } else {
      whereClause.OR = [
        { buyerId: userId },
        { sellerId: userId }
      ]
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            image: true,
            reputationScore: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
            reputationScore: true
          }
        },
        intel: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true
          }
        },
        demand: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true
          }
        },
        updates: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        conversations: {
          include: {
            messages: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Add computed fields
    const enrichedTransactions = transactions.map(transaction => {
      const isBuyer = transaction.buyerId === userId
      const isSeller = transaction.sellerId === userId
      const canProvideUpdate = isSeller && transaction.status === 'RELEASED'
      const canStartConversation = transaction.status === 'RELEASED'
      const canRefund = isBuyer && transaction.status === 'RELEASED'
      
      // Check if 5 days have passed for updates
      const fiveDaysAgo = new Date()
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
      const canProvideUpdateNow = canProvideUpdate && transaction.createdAt <= fiveDaysAgo

      return {
        ...transaction,
        isBuyer,
        isSeller,
        canProvideUpdate: canProvideUpdateNow,
        canStartConversation,
        canRefund,
        latestUpdate: transaction.updates[0] || null,
        latestMessage: transaction.conversations[0]?.messages[0] || null,
        conversationId: transaction.conversations[0]?.id || null
      }
    })

    return NextResponse.json({ transactions: enrichedTransactions })

  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { transactionId, action, data } = await request.json()

    if (!transactionId || !action) {
      return NextResponse.json({ error: 'Transaction ID and action are required' }, { status: 400 })
    }

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

    switch (action) {
      case 'release':
        if (transaction.sellerId !== userId) {
          return NextResponse.json({ error: 'Only the seller can release funds' }, { status: 403 })
        }
        
        if (transaction.status !== 'ESCROW') {
          return NextResponse.json({ error: 'Transaction is not in escrow state' }, { status: 400 })
        }

        // Release funds to seller
        await prisma.transaction.update({
          where: { id: transactionId },
          data: { status: 'RELEASED' }
        })

        // Update seller credits
        await prisma.user.update({
          where: { id: transaction.sellerId },
          data: {
            creditsBalance: {
              increment: transaction.creditsSpent - transaction.platformFee
            }
          }
        })

        // Create ledger entry for seller
        await prisma.creditsLedger.create({
          data: {
            userId: transaction.sellerId,
            type: 'EARN',
            amount: transaction.creditsSpent - transaction.platformFee,
            balanceAfter: transaction.seller.creditsBalance + (transaction.creditsSpent - transaction.platformFee),
            referenceId: transactionId
          }
        })

        return NextResponse.json({ success: true, message: 'Funds released successfully' })

      case 'dispute':
        if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
          return NextResponse.json({ error: 'Only transaction participants can dispute' }, { status: 403 })
        }

        await prisma.transaction.update({
          where: { id: transactionId },
          data: { status: 'DISPUTED' }
        })

        return NextResponse.json({ success: true, message: 'Dispute initiated' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error managing transaction:', error)
    return NextResponse.json({ error: 'Failed to manage transaction' }, { status: 500 })
  }
}
