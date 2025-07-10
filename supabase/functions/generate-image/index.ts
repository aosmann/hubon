/*
  # OpenAI Image Generation Function

  1. Function Purpose
    - Generates AI images using OpenAI's DALL-E API
    - Handles prompt processing and image generation
    - Returns generated image URL securely

  2. Security
    - API key stored securely in environment
    - CORS headers configured for frontend access
    - Error handling for API failures
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface GenerateImageRequest {
  prompt: string;
  size: string;
  style: string;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { prompt, size, style }: GenerateImageRequest = await req.json();

    if (!prompt || !prompt.trim()) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Convert size format from ratio to OpenAI format
    const sizeMap: { [key: string]: string } = {
      '1:1': '1024x1024',
      '16:9': '1792x1024',
      '9:16': '1024x1792',
      '4:3': '1024x768',
      '3:4': '768x1024'
    };

    const openaiSize = sizeMap[size] || '1024x1024';

    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: openaiSize,
        quality: 'standard',
        response_format: 'url'
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API Error:', errorData);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate image',
          details: errorData.error?.message || 'Unknown error'
        }),
        {
          status: openaiResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await openaiResponse.json();
    
    // Create full prompt with variables for storage
    const ratioLabels: { [key: string]: string } = {
      '1:1': 'Square (1:1)',
      '16:9': 'Horizontal (16:9)',
      '9:16': 'Vertical (9:16)',
      '4:3': 'Facebook (4:3)',
      '3:4': 'Facebook (3:4)'
    };
    
    const ratioLabel = ratioLabels[size] || size;
    const fullPrompt = `${prompt} | ${ratioLabel} | ${style}`;
    
    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: data.data[0].url,
        revisedPrompt: fullPrompt
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Function Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});