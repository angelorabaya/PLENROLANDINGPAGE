export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, conversationId } = await req.json();

    // Native environment lookups (no external packages required)
    const apiKey = process.env.DIFY_API_KEY;
    const apiUrl = process.env.DIFY_API_URL;

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