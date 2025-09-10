import { NextResponse } from "next/server";
import { embed } from "@/lib/ai/embeddings";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    console.log(`🔄 Generating embedding for text: "${text.substring(0, 50)}..."`);

    const embedding = await embed(text);

    return NextResponse.json({ 
      embedding,
      text: text.substring(0, 100) + (text.length > 100 ? "..." : "")
    });

  } catch (error) {
    console.error("Embedding generation error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { 
        error: "Failed to generate embedding",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
