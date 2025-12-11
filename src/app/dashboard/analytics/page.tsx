"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, TrendingUp, ShoppingCart, DollarSign } from "lucide-react";

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>({
    totalViews: 0,
    totalSales: 0,
    totalRevenue: 0,
    conversionRate: 0,
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id);

    const { data: sales } = await supabase
      .from('sales')
      .select('amount')
      .eq('seller_id', user.id);

    if (products && sales) {
      const totalViews = products.reduce((sum, p) => sum + (p.views_count || 0), 0);
      const totalSales = sales.length;
      const totalRevenue = sales.reduce((sum, s) => sum + Number(s.amount), 0);
      const conversionRate = totalViews > 0 ? (totalSales / totalViews) * 100 : 0;
      
      const topProducts = products
        .sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))
        .slice(0, 5);

      setAnalytics({
        totalViews,
        totalSales,
        totalRevenue,
        conversionRate,
        topProducts,
      });
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background p-6 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-sky-500/10 rounded-lg">
              <Eye className="h-5 w-5 text-sky-500" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-muted-foreground mb-1">Total Views</h3>
          <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-green-500" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-muted-foreground mb-1">Total Sales</h3>
          <p className="text-2xl font-bold">{analytics.totalSales}</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-500" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-muted-foreground mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <h3 className="font-medium text-muted-foreground mb-1">Conversion Rate</h3>
          <p className="text-2xl font-bold">{analytics.conversionRate.toFixed(2)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">Top Performing Products</h2>
          {analytics.topProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No products yet</p>
          ) : (
            <div className="space-y-4">
              {analytics.topProducts.map((product: any, index: number) => (
                <div key={product.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center font-semibold text-sky-500">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.views_count || 0} views • {product.sales_count || 0} sales
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-sky-500">${product.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <span className="text-sm font-medium">{analytics.conversionRate.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-accent rounded-full h-2">
                <div 
                  className="bg-sky-500 h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min(analytics.conversionRate, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Average Views per Product</span>
                <span className="text-sm font-medium">
                  {analytics.topProducts.length > 0 
                    ? Math.round(analytics.totalViews / analytics.topProducts.length)
                    : 0}
                </span>
              </div>
              <div className="w-full bg-accent rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Sales Success Rate</span>
                <span className="text-sm font-medium">
                  {analytics.topProducts.length > 0 
                    ? ((analytics.totalSales / analytics.topProducts.length) * 10).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-accent rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
