export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, conversationId } = await req.json();

    const response = await fetch(`${process.env.DIFY_API_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {}, // Pass any global variables configured in your Dify dashboard here
        query: message,
        response_mode: 'blocking', // Using 'blocking' keeps the integration simple for now
        conversation_id: conversationId || "", // Stays blank on the first message, links thread memory after
        user: "site_visitor_session" // Dify requires a user identifier to avoid cross-talk between separate people
      }),
    });

    if (!response.ok) {
      throw new Error('Dify API returned an error status');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dify Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to process communication with Dify' }, { status: 500 });
  }
}