
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

export const fetchStaffList = async (): Promise<StaffMember[]> => {
  return [
    {
      id: 'st-001',
      name: 'Super Admin',
      email: 'hq@crubs.com',
      role: 'admin',
      permissions: { access_orders: true, access_inventory: true, access_revenue_data: true }
    },
    {
      id: 'st-002',
      name: 'Store Manager',
      email: 'nyahururu-store@crubs.com',
      role: 'staff',
      permissions: { access_orders: true, access_inventory: true, access_revenue_data: false }
    },
    {
      id: 'st-003',
      name: 'Logistics Clerk',
      email: 'delivery@crubs.com',
      role: 'staff',
      permissions: { access_orders: true, access_inventory: false, access_revenue_data: false }
    }
  ];
};
