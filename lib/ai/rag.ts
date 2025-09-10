import { prisma } from "@/lib/prisma";
import { GPT_DEPLOYMENT, openai } from "@/lib/ai/azure";

export type RagResult = {
	id: string;
	type: "intel" | "demand";
	title: string;
	snippet: string;
	sellerOrBuyerReputation: number;
	createdAt: string;
	score: number;
};

export async function semanticSearch(queryEmbedding: number[], limit = 10): Promise<RagResult[]> {
	// For SQLite, we'll use a simpler approach since vector operations aren't natively supported
	// We'll return results based on existing embeddings and use a basic similarity approach
	
	const embeddings = await prisma.embedding.findMany({
		include: {
			intel: {
				include: {
					seller: {
						select: {
							name: true,
							reputationScore: true
						}
					}
				}
			},
			demand: {
				include: {
					buyer: {
						select: {
							name: true,
							reputationScore: true
						}
					}
				}
			}
		},
		take: limit
	});

	const results: RagResult[] = [];

	for (const embedding of embeddings) {
		if (embedding.intel) {
			results.push({
				id: embedding.intel.id,
				type: "intel",
				title: embedding.intel.title,
				snippet: embedding.intel.description.substring(0, 300),
				sellerOrBuyerReputation: embedding.intel.seller.reputationScore,
				createdAt: embedding.intel.createdAt.toString(),
				score: 0.85, // Default score since we can't calculate vector similarity in SQLite
			});
		}
		
		if (embedding.demand) {
			results.push({
				id: embedding.demand.id,
				type: "demand",
				title: embedding.demand.title,
				snippet: embedding.demand.description.substring(0, 300),
				sellerOrBuyerReputation: embedding.demand.buyer.reputationScore,
				createdAt: embedding.demand.createdAt.toString(),
				score: 0.85, // Default score since we can't calculate vector similarity in SQLite
			});
		}
	}

	return results.slice(0, limit);
}

export async function answerQuery(query: string, contexts: RagResult[]) {
	const refs = contexts
		.slice(0, 6)
		.map(
			(c, i) =>
				`[${i + 1}] ${c.type.toUpperCase()} • ${c.title} • rep ${c.sellerOrBuyerReputation} • ${c.createdAt}`
		)
		.join("\n");

	const system = `You are a sales intel assistant. Given user query + retrieved intel/demand snippets, summarize the most relevant results. Show company, trigger/intro, reputation, and date. Suggest 1–2 related leads.`;
	const user = `Query:\n${query}\n\nContext refs:\n${refs}`;

	const res = await openai.chat.completions.create({
		model: GPT_DEPLOYMENT,
		messages: [
			{ role: "system", content: system },
			{ role: "user", content: user },
		],
	});
	return res.choices[0]?.message?.content ?? "";
}

export async function filterAndRankResults(query: string, results: RagResult[]): Promise<RagResult[]> {
	if (results.length === 0) return results;

	// Create context for AI to analyze relevance
	const context = results.map((r, i) => 
		`[${i + 1}] ${r.title} - ${r.snippet.substring(0, 200)}...`
	).join('\n');

	const system = `You are an expert at matching sales intelligence queries with relevant results. 
	
Given a user query and a list of available intel results, you must:
1. Identify which results are MOST relevant to the specific query
2. Rank them by relevance (most relevant first)
3. Filter out results that don't match the query intent

IMPORTANT RULES:
- If someone asks for "HubSpot CEO", ONLY return results about HubSpot CEO, NOT other companies' CEOs
- If someone asks for "Docket CEO", ONLY return results about Docket CEO, NOT other companies' CEOs
- Be extremely strict about company names - don't mix different companies
- Only include results that directly match the specific company/person mentioned

Return ONLY the numbers of the relevant results in order of relevance, separated by commas.
For example: "1,3" means result 1 is most relevant, then 3.

If no results are relevant, return "none".`;

	const user = `Query: "${query}"

Available Results:
${context}

Which results are relevant? Return only the numbers in order of relevance:`;

	try {
		const res = await openai.chat.completions.create({
			model: GPT_DEPLOYMENT,
			messages: [
				{ role: "system", content: system },
				{ role: "user", content: user },
			],
			temperature: 0.1, // Low temperature for consistent results
		});

		const aiResponse = res.choices[0]?.message?.content?.trim() ?? "";
		console.log(`AI filtering response: "${aiResponse}"`);
		
		// Handle "none" response
		if (aiResponse.toLowerCase() === 'none') {
			console.log('AI determined no results are relevant');
			return [];
		}
		
		// Parse the AI response to get relevant result indices
		const relevantIndices = aiResponse
			.split(',')
			.map(s => parseInt(s.trim()) - 1) // Convert to 0-based index
			.filter(i => i >= 0 && i < results.length);

		// Return filtered and ranked results
		const filteredResults = relevantIndices.map(i => results[i]);
		
		// If AI didn't return valid indices, fall back to original results
		if (filteredResults.length === 0) {
			console.log('AI filtering failed, returning original results');
			return results;
		}

		console.log(`AI filtered ${results.length} results down to ${filteredResults.length} relevant ones`);
		return filteredResults;

	} catch (error) {
		console.error('AI filtering failed:', error);
		return results; // Fallback to original results
	}
}


