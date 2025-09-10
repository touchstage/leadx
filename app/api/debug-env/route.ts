import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY ? 'Present' : 'Missing',
    AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_DEPLOYMENT_NAME: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
    OPENAI_API_VERSION: process.env.OPENAI_API_VERSION,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments`,
  });
}
