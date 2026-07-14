export const runtime = 'edge';

import { NextResponse } from 'next/server';
// Import the helper to grab Cloudflare's runtime environment
import { getOptionalRequestContext } from '@cloudflare/next-on-pages';

export async function POST(req: Request) {
  try {
    const { message, conversationId } = await req.json();

    // 1. Get the Cloudflare runtime context if it exists
    const cloudflareContext = getOptionalRequestContext();
    
    // 2. Fall back to process.env if running locally, otherwise use Cloudflare bindings
    const apiKey = cloudflareContext?.env?.DIFY_API_KEY || process.env.DIFY_API_KEY;
    const apiUrl = cloudflareContext?.env?.DIFY_API_URL || process.env.DIFY_API_URL;

    // Safety check to ensure the route isn't running blind
    if (!apiKey || !apiUrl) {
      throw new Error('Dify API credentials are missing from the current environment.');
    }

    const response = await fetch(`${apiUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        conversation_id: conversationId || "",
        user: "site_visitor_session"
      }),
    });

    if (!response.ok) {
      throw new Error(`Dify API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dify Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to process communication with Dify' }, 
      { status: 500 }
    );
  }
}