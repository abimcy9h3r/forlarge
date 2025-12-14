import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CreatorProductsProps {
  creatorId: string;
  currentProductId: string;
}

export async function CreatorProducts({ creatorId, currentProductId }: CreatorProductsProps) {
  const supabase = createClient();

  // Get other products from the same creator
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', creatorId)
    .eq('is_active', true)
    .neq('id', currentProductId)
    .order('created_at', { ascending: false })
    .limit(3);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-light">More from this Creator</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              {product.cover_image_url && (
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.cover_image_url}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-light line-clamp-1">{product.title}</CardTitle>
                <CardDescription className="font-light line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-light text-sky-500">${product.price}</span>
                  <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
