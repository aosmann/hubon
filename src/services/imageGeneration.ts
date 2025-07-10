export interface GenerateImageParams {
  prompt: string;
  ratio: string;
  style: string;
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  revisedPrompt?: string;
  error?: string;
  details?: string;
}

export const generateImage = async (params: GenerateImageParams): Promise<GenerateImageResponse> => {
  try {
    // Use the deployed Supabase Edge Function URL directly
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are not configured');
    }

    const functionUrl = `${supabaseUrl}/functions/v1/generate-image`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        prompt: params.prompt,
        size: params.ratio,
        style: params.style,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate image';
      let errorDetails = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        errorDetails = errorData.details || errorDetails;
      } catch {
        // If JSON parsing fails, use the status text
        errorDetails = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(`${errorMessage} - ${errorDetails}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Image generation error:', error);
    return {
      success: false,
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};