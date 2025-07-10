import { supabase } from '../lib/supabase';

export interface SaveImageParams {
  prompt: string;
  imageUrl: string;
}

export interface ImageRecord {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

export const saveGeneratedImage = async (params: SaveImageParams): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('images')
      .insert({
        prompt: params.prompt,
        image_url: params.imageUrl,
      });

    if (error) {
      console.error('Error saving image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving image:', error);
    return false;
  }
};

export const getImageHistory = async (): Promise<ImageRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching images:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};