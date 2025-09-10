import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const { demandId, content, attachments } = await req.json();

	const fulfillment = await prisma.demandFulfillment.create({
		data: {
			demandId,
			sellerId: user.id,
			content,
			attachments,
		},
	});

	return NextResponse.json({ fulfillment });
}


