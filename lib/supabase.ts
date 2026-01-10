
import { createClient } from '@supabase/supabase-js';
import { StaffMember } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a file to Supabase Storage 'product-images' bucket
 * Returns the public URL of the uploaded image
 */
export const uploadProductImage = async (file: File): Promise<string> => {
  // If we have valid Supabase config, try real upload
  if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  // Fallback: Return a local DataURL for preview/mock purposes
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};

export const fetchStaffProfile = async (userId: string): Promise<StaffMember | null> => {
  const { data, error } = await supabase
    .from('staff_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  // Fetch email from auth user if possible, or store it in profile.
  // For now, we'll try to get it from the session if available in the caller, 
  // or we can just return the profile data.
  // Note: staff_profiles might not have email. auth.users has it.
  // We will assume email is passed or retrieved separately if needed, 
  // but let's see if we can get it from the user object in the session.

  return {
    id: data.id,
    name: data.full_name || 'Staff Member',
    email: '', // Start empty, fill in App.tsx from auth.user
    role: data.role as 'admin' | 'staff',
    permissions: { access_orders: true, access_inventory: true, access_revenue_data: data.role === 'admin' }
  };
};

// Legacy mock - kept for type compliance if needed, but unused in new flow
export const fetchStaffList = async (): Promise<StaffMember[]> => {
  return [];
};
