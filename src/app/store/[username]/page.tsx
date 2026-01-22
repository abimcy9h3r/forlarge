import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { MapPin, Calendar, Package } from 'lucide-react';

export default async function CreatorStorePage({ params }: { params: { username: string } }) {
  const supabase = await createClient();

  // Get creator info from profiles table
  const { data: creator, error: creatorError } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, bio, created_at')
    .eq('username', params.username)
    .single();

  if (creatorError || !creator) {
    notFound();
  }

  // Get creator's products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', creator.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const totalProducts = products?.length || 0;
  const totalSales = products?.reduce((sum, p) => sum + (p.purchase_count || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-8 py-12 md:py-16 mt-16 md:mt-0">
        {/* Creator Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-sky-500/10 to-purple-500/10 rounded-2xl p-8 md:p-12 border border-sky-500/20">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-sky-500 flex items-center justify-center text-white text-3xl font-light">
                {params.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-light mb-2">@{params.username}</h1>
                <p className="text-muted-foreground mb-4">{creator.bio || "Digital Creator on Forlarge"}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {totalProducts} Products
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(creator.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-light">Products</h2>
            <p className="text-sm text-muted-foreground">{totalProducts} items</p>
          </div>

          {!products || products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No products available yet</p>
              </CardContent>
            </Card>
          ) : (
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
                      {product.purchase_count > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {product.purchase_count} sale{product.purchase_count !== 1 ? 's' : ''}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
