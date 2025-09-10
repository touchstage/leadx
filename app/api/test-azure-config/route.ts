import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
    const apiKey = process.env.AZURE_OPENAI_API_KEY!;
    const deployment = process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME!;
    const apiVersion = process.env.OPENAI_API_VERSION!;

    const baseURL = `${endpoint}/openai/deployments`;
    
    console.log('🔧 Azure Configuration Debug:');
    console.log('Endpoint:', endpoint);
    console.log('BaseURL:', baseURL);
    console.log('Deployment:', deployment);
    console.log('API Version:', apiVersion);

    // Test the OpenAI client configuration
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL,
      defaultQuery: { 'api-version': apiVersion },
      defaultHeaders: {
        'api-key': apiKey,
      },
    });

    // Try to make a simple call to see what URL is actually being used
    try {
      const response = await openai.embeddings.create({
        model: deployment,
        input: "test",
      });
      
      return NextResponse.json({
        success: true,
        config: {
          endpoint,
          baseURL,
          deployment,
          apiVersion
        },
        result: {
          vectorLength: response.data[0].embedding.length,
          model: response.model
        }
      });
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        config: {
          endpoint,
          baseURL,
          deployment,
          apiVersion
        },
        error: {
          message: error.message,
          status: error.status,
          code: error.code
        }
      });
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}
