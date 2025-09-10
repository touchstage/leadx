import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	const items = await prisma.demand.findMany({
		orderBy: { createdAt: "desc" },
		select: { id: true, title: true, description: true, bountyCredits: true, status: true, createdAt: true },
		take: 30,
	});
	return NextResponse.json({ items });
}


