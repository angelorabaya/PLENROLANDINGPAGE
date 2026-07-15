/**
 * Cloudflare Pages Function — Dify chat proxy
 * 
 * Cloudflare Pages static exports do NOT include Next.js API routes.
 * This serverless function handles POST /api/chat on the edge instead.
 * 
 * Environment variables DIFY_API_KEY and DIFY_API_URL must be set in
 * the Cloudflare dashboard under Settings → Environment Variables.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS preflight is handled automatically by Cloudflare Pages for
  // same-origin requests, but we set headers for safety.
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { message, conversationId } = await request.json();

    const apiKey = env.DIFY_API_KEY;
    const apiUrl = env.DIFY_API_URL;

    if (!apiKey || !apiUrl) {
      return new Response(
        JSON.stringify({ error: 'Dify API credentials are missing from the environment.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const difyResponse = await fetch(`${apiUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'blocking',
        conversation_id: conversationId || '',
        user: 'site_visitor_session',
      }),
    });

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text();
      console.error('Dify API error:', difyResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: `Dify API responded with status: ${difyResponse.status}` }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const data = await difyResponse.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Chat proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process communication with Dify' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

/**
 * Handle OPTIONS preflight requests for CORS.
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
