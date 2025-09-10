import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
	try {
		const { userId } = await auth();
		
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const my = searchParams.get("my");

		let whereClause = {};
		
		// If "my=true" parameter is provided, filter by current user
		if (my === "true") {
			// Find user by Clerk ID
			const user = await prisma.user.findUnique({
				where: { clerkId: userId }
			});
			
			if (!user) {
				return NextResponse.json({ error: "User not found" }, { status: 404 });
			}
			
			whereClause = {
				sellerId: user.id
			};
		}

		const intel = await prisma.intel.findMany({
			where: whereClause,
			orderBy: { createdAt: "desc" },
			select: { 
				id: true, 
				title: true, 
				description: true, 
				category: true, 
				priceCredits: true, 
				status: true,
				createdAt: true,
				updatedAt: true
			},
			take: 50,
		});

		return NextResponse.json({ intel });
	} catch (error) {
		console.error("Error fetching intel:", error);
		return NextResponse.json({ error: "Failed to fetch intel" }, { status: 500 });
	}
}


