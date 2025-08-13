import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fonction pour vérifier si Supabase est configuré
export const isSupabaseConfigured = () => {
  const isConfigured = supabaseUrl && 
                      supabaseAnonKey && 
                      supabaseUrl !== 'your-supabase-url' &&
                      supabaseAnonKey !== 'your-supabase-anon-key' &&
                      supabaseUrl.includes('.supabase.co') && 
                      supabaseAnonKey.length > 20;
  
  console.log('🔧 [CONFIG] === CONFIGURATION SUPABASE ===');
  console.log('🔧 [CONFIG] URL complète:', supabaseUrl);
  console.log('🔧 [CONFIG] URL valide (.supabase.co):', supabaseUrl?.includes('.supabase.co'));
  console.log('🔧 [CONFIG] Clé présente:', !!supabaseAnonKey);
  console.log('🔧 [CONFIG] Longueur clé:', supabaseAnonKey?.length);
  console.log('🔧 [CONFIG] Configuration finale:', isConfigured);
  
  if (!isConfigured) {
    console.error('❌ [CONFIG] Supabase mal configuré !');
    console.error('❌ [CONFIG] URL:', supabaseUrl);
    console.error('❌ [CONFIG] Clé (premiers chars):', supabaseAnonKey?.substring(0, 20) + '...');
  }
  
  return isConfigured;
};

// Créer le client seulement si configuré
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;


// Types pour TypeScript
export interface DatabaseDish {
  id: string;
  nom: string;
  categorie: string;
  langue: string;
  ingredients: string[];
  allergenes: string[];
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DishModification {
  id: string;
  dish_id: string;
  user_id: string | null;
  user_email: string;
  action_type: 'created' | 'updated' | 'deleted';
  changes: any;
  created_at: string;
  dish_name?: string;
  dish_category?: string;
}