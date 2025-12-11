import { createClient } from '@/lib/supabase/client';

export async function getProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
}

export async function updateProfile(userId: string, updates: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
}

export async function getProducts(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
}

export async function getSales(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      product:products(title, cover_image_url)
    `)
    .eq('seller_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
}

export async function getDashboardStats(userId: string) {
  const supabase = createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('id, views_count, sales_count')
    .eq('user_id', userId);
  
  const { data: sales } = await supabase
    .from('sales')
    .select('amount')
    .eq('seller_id', userId);
  
  const totalSales = sales?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;
  const totalViews = products?.reduce((sum, product) => sum + product.views_count, 0) || 0;
  const totalProducts = products?.length || 0;
  const totalOrders = sales?.length || 0;
  
  return {
    totalSales,
    totalViews,
    totalProducts,
    totalOrders
  };
}
