
import { supabase } from './supabase';

export async function testSupabaseConnection() {
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, is_active')
        .eq('is_active', true);

    if (error) {
        console.error('❌ Supabase connection failed:', error.message);
        return;
    }

    console.log('✅ Supabase connection successful!');
    console.log('Categories fetched:', data);
}
