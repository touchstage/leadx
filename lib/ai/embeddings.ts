import { openai, EMBEDDINGS_DEPLOYMENT } from "./azure";

export async function embed(text: string): Promise<number[]> {
	try {
		const response = await openai.embeddings.create({
			model: EMBEDDINGS_DEPLOYMENT,
			input: text,
		});

		return response.data[0].embedding;
	} catch (error) {
		console.error("Embedding error:", error);
		throw new Error(`Failed to create embedding: ${error}`);
	}
}


