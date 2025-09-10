import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { embed } from "@/lib/ai/embeddings";
import { upsertEmbedding } from "@/lib/db/vector";

export async function POST(req: Request) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "unauthorized" }, { status: 401 });
		}

		const { title, description, bountyCredits, deadline, category, additionalDetails } = await req.json();

		// Validate required fields
		if (!title || !description || !bountyCredits) {
			return NextResponse.json(
				{ error: "Title, description, and bounty are required" },
				{ status: 400 }
			);
		}

		// Find or create user based on Clerk userId
		let user = await prisma.user.findUnique({
			where: { clerkId: userId }
		});

		if (!user) {
			// Create new user with Clerk ID
			user = await prisma.user.create({
				data: {
					clerkId: userId,
					email: 'user@example.com', // Will be updated when we get user info
					name: 'User',
					company: 'Unknown',
					role: 'Sales Professional',
					creditsBalance: 100, // Starting credits
					kycVerified: false
				}
			});
			console.log(`Created new user with Clerk ID: ${userId}`);
		}

		const correctBuyerId = user.id;

		const demand = await prisma.demand.create({
			data: {
				title,
				description,
				bountyCredits: parseInt(bountyCredits),
				deadline: deadline ? parseInt(deadline) : 7,
				category: category || "General",
				additionalDetails: additionalDetails || "",
				buyerId: correctBuyerId,
			},
		});

		// Create embedding for AI search
		try {
			const vector = await embed([title, description].join("\n"));
			await upsertEmbedding({ kind: "demand", id: demand.id, vector });
		} catch (embeddingError) {
			console.error("Error creating embedding:", embeddingError);
			// Continue without embedding - demand is still created
		}

		return NextResponse.json({ id: demand.id, demand });
	} catch (error) {
		console.error("Error creating demand:", error);
		return NextResponse.json(
			{ error: "Failed to create demand" },
			{ status: 500 }
		);
	}
}


