import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { embed } from "@/lib/ai/embeddings";
import { upsertEmbedding } from "@/lib/db/vector";
export async function POST(req: Request) {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ error: "unauthorized" }, { status: 401 });
		}

		const { title, description, category, priceCredits, additionalDetails, attachments } = await req.json();

		// Validate required fields
		if (!title || !description || !category || !priceCredits) {
			return NextResponse.json(
				{ error: "Title, description, category, and price are required" },
				{ status: 400 }
			);
		}

		const intel = await prisma.intel.create({
			data: {
				title,
				description,
				category,
				priceCredits: parseInt(priceCredits),
				attachments: attachments ? JSON.parse(attachments) : null,
				sellerId: user.id,
				status: 'PUBLISHED',
			},
		});

		// Create embedding for AI search
		try {
			const vector = await embed([title, description].join("\n"));
			await upsertEmbedding({ kind: "intel", id: intel.id, vector });
		} catch (embeddingError) {
			console.error("Error creating embedding:", embeddingError);
			// Continue without embedding - intel is still created
		}

		return NextResponse.json({ id: intel.id, intel });
	} catch (error) {
		console.error("Error creating intel:", error);
		return NextResponse.json(
			{ error: "Failed to create intel" },
			{ status: 500 }
		);
	}
}