import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");
	if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
	const intel = await prisma.intel.findUnique({ where: { id }, include: { seller: true } });
	if (!intel) return NextResponse.json({ error: "not found" }, { status: 404 });
	return NextResponse.json({ intel });
}


