import { NextRequest, NextResponse } from 'next/server'


import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    // Get updates for a specific transaction
    const updates = await prisma.intelUpdate.findMany({
      where: {
        transactionId: transactionId,
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        transaction: {
          include: {
            intel: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ updates })

  } catch (error) {
    console.error('Error fetching updates:', error)
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { transactionId, title, content, attachments } = await request.json()

    if (!transactionId || !title || !content) {
      return NextResponse.json({ error: 'Transaction ID, title, and content are required' }, { status: 400 })
    }

    // Verify the transaction exists and user is the seller
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        seller: true,
        buyer: true,
        intel: true
      }
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    if (transaction.sellerId !== userId) {
      return NextResponse.json({ error: 'Only the seller can provide updates' }, { status: 403 })
    }

    if (transaction.status !== 'RELEASED') {
      return NextResponse.json({ error: 'Transaction must be released to provide updates' }, { status: 400 })
    }

    // Check if 5 days have passed since transaction
    const fiveDaysAgo = new Date()
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
    
    if (transaction.createdAt > fiveDaysAgo) {
      return NextResponse.json({ error: 'Updates can only be provided after 5 days from purchase' }, { status: 400 })
    }

    // Create the update
    const update = await prisma.intelUpdate.create({
      data: {
        transactionId,
        intelId: transaction.intelId!,
        sellerId: userId,
        buyerId: transaction.buyerId,
        title,
        content,
        attachments: attachments || null
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({ update })

  } catch (error) {
    console.error('Error creating update:', error)
    return NextResponse.json({ error: 'Failed to create update' }, { status: 500 })
  }
}
