import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get active intel listings count (PUBLISHED status)
    const activeIntelCount = await prisma.intel.count({
      where: {
        status: 'PUBLISHED'
      }
    })

    // Get total value traded (sum of all intel priceCredits for sold items)
    const totalValueTraded = await prisma.intel.aggregate({
      where: {
        status: 'SOLD'
      },
      _sum: {
        priceCredits: true
      }
    })

    // Get average rating from Rating model
    const averageRating = await prisma.rating.aggregate({
      _avg: {
        stars: true
      }
    })

    // Get total users count
    const totalUsers = await prisma.user.count()

    // Get total demands count
    const totalDemands = await prisma.demand.count()

    const stats = {
      activeIntelListings: activeIntelCount,
      totalValueTraded: totalValueTraded._sum.priceCredits || 0,
      averageRating: averageRating._avg.stars ? Number(averageRating._avg.stars.toFixed(1)) : 0,
      totalUsers,
      totalDemands
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching platform stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform statistics' },
      { status: 500 }
    )
  }
}
