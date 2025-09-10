import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { embed } from "@/lib/ai/embeddings";
import { semanticSearch, answerQuery, filterAndRankResults } from "@/lib/ai/rag";

export async function POST(req: Request) {
	try {
		const { query } = await req.json();

		if (!query || typeof query !== "string") {
			return NextResponse.json(
				{ error: "Query is required" },
				{ status: 400 }
			);
		}

		console.log(`🔍 Search query: "${query}"`);

		// Clean and prepare search terms
		const cleanQuery = query.trim().toLowerCase();
		
		// Try RAG semantic search first
		let ragResults: any[] = [];
		let aiAnswer = "";
		
		try {
			console.log("🧠 Attempting RAG semantic search...");
			const queryEmbedding = await embed(cleanQuery);
			const rawRagResults = await semanticSearch(queryEmbedding, 15); // Get more results for AI filtering
			
			// Use AI to filter and rank results based on query intent
			if (rawRagResults.length > 0) {
				console.log("🤖 Using AI to filter and rank results...");
				ragResults = await filterAndRankResults(cleanQuery, rawRagResults);
				
				// Generate AI answer if we have filtered results
				if (ragResults.length > 0) {
					aiAnswer = await answerQuery(cleanQuery, ragResults);
				}
			}
			
			console.log(`🎯 RAG found ${ragResults.length} AI-filtered semantic results`);
		} catch (ragError) {
			console.error("RAG search failed, falling back to basic search:", ragError);
		}

		// Fallback to basic text search if RAG fails or returns no results
		let intel: any[] = [];
		let demands: any[] = [];
		
		if (ragResults.length === 0) {
			console.log("📝 Using basic text search fallback...");
			
			// Search intel using raw SQL for case-insensitive search in SQLite
			intel = await prisma.$queryRaw`
				SELECT i.*, u.name as seller_name, u."reputationScore" as seller_reputation, u."kycVerified" as seller_kyc
				FROM "Intel" i
				JOIN "User" u ON u.id = i."sellerId"
				WHERE i.status = 'PUBLISHED'
				AND (
					LOWER(i.title) LIKE LOWER(${`%${cleanQuery}%`}) OR
					LOWER(i.description) LIKE LOWER(${`%${cleanQuery}%`}) OR
					LOWER(i.category) LIKE LOWER(${`%${cleanQuery}%`})
				)
				ORDER BY i."createdAt" DESC
				LIMIT 10
			`;

			// Search demands using raw SQL for case-insensitive search in SQLite
			demands = await prisma.$queryRaw`
				SELECT d.*, u.name as buyer_name, u."reputationScore" as buyer_reputation, u."kycVerified" as buyer_kyc
				FROM "Demand" d
				JOIN "User" u ON u.id = d."buyerId"
				WHERE d.status = 'OPEN'
				AND (
					LOWER(d.title) LIKE LOWER(${`%${cleanQuery}%`}) OR
					LOWER(d.description) LIKE LOWER(${`%${cleanQuery}%`}) OR
					LOWER(d.category) LIKE LOWER(${`%${cleanQuery}%`})
				)
				ORDER BY d."createdAt" DESC
				LIMIT 10
			`;
		}

		console.log(`📊 Found ${ragResults.length} RAG results, ${intel.length} intel, ${demands.length} demands`);

		return NextResponse.json({
			query: cleanQuery,
			intel: ragResults.length > 0 ? ragResults : intel,
			demands: ragResults.length > 0 ? [] : demands, // RAG results include both intel and demands
			aiAnswer: aiAnswer || null,
			searchType: ragResults.length > 0 ? "semantic" : "text",
		});

	} catch (error) {
		console.error("Search error:", error);
		return NextResponse.json(
			{ error: "Search failed" },
			{ status: 500 }
		);
	}
}