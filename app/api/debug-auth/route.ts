import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    
    return NextResponse.json({
      userId: userId,
      isAuthenticated: !!userId,
      headers: Object.fromEntries(req.headers.entries())
    });

  } catch (error) {
    console.error("Error in debug auth:", error);
    return NextResponse.json(
      { error: "Failed to debug auth", details: error.message },
      { status: 500 }
    );
  }
}
