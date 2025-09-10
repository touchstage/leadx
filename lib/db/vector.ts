import { prisma } from "@/lib/prisma";

export async function upsertEmbedding(params: {
	kind: "intel" | "demand";
	id: string;
	vector: number[];
	metadata?: Record<string, unknown>;
}) {
	const vectorSql = `[${params.vector.join(",")}]`;
	const column = params.kind === "intel" ? '"intelId"' : '"demandId"';
	const id = params.id;
	const meta = params.metadata ? JSON.stringify(params.metadata) : null;

	await prisma.$executeRawUnsafe(
		`INSERT INTO "Embedding" (${column}, "vector", "metadata")
		 VALUES ($1, $2::vector, $3::jsonb)
		 ON CONFLICT (${column}) DO UPDATE SET "vector" = EXCLUDED."vector", "metadata" = EXCLUDED."metadata"`,
		id,
		vectorSql,
		meta
	);
}


