/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImageToStorage(file: File): Promise<string> {
  const timestamp = Date.now();
  const uuid = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop() || 'png';
  const fileName = `${timestamp}-${uuid}.${extension}`;
  
  const { data, error } = await supabase.storage
    .from('cms-images')
    .upload(`uploads/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from('cms-images')
    .getPublicUrl(`uploads/${fileName}`);

  return publicUrlData.publicUrl;
}

export async function saveToSupabase(key: string, data: any): Promise<void> {
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({ id: key, data: data, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    
    if (error) throw error;
    console.log(`[Supabase] Successfully saved key "${key}" to cloud database.`);
  } catch (error) {
    console.error(`[Supabase] Failed to save key "${key}":`, error);
  }
}

export async function loadFromSupabase(key: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('id', key)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // ignore no rows error
    return data ? data.data : null;
  } catch (error) {
    console.error(`[Supabase] Failed to load key "${key}":`, error);
    return null;
  }
}

export function setupSupabaseRealtimeListener(onUpdate: (key: string, data: any) => void): () => void {
  // Fetch initial state first to overwrite local cache
  supabase
    .from('site_content')
    .select('*')
    .then(({ data, error }) => {
      if (!error && data) {
        data.forEach(record => {
          if (record.id && record.data) {
            onUpdate(record.id, record.data);
          }
        });
      }
    });

  const channel = supabase
    .channel('public:site_content')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'site_content' },
      (payload) => {
        const { new: newRecord } = payload;
        if (newRecord && (newRecord as any).id && (newRecord as any).data) {
          onUpdate((newRecord as any).id, (newRecord as any).data);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
