"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DollarSign, Download, Calendar } from "lucide-react";

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    avgOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        product:products(title, cover_image_url, price)
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setSales(data);
      const totalRevenue = data.reduce((sum, sale) => sum + Number(sale.amount), 0);
      const totalSales = data.length;
      const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
      
      setStats({
        totalRevenue,
        totalSales,
        avgOrderValue,
      });
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background p-6 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sales</h1>
        <p className="text-muted-foreground mt-1">Track your revenue and transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-sky-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-sky-500" />
            </div>
            <span className="text-sm text-muted-foreground">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Download className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">Total Sales</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalSales}</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-sm text-muted-foreground">Avg Order Value</span>
          </div>
          <p className="text-3xl font-bold">${stats.avgOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
        </div>
        
        {sales.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No sales yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sales.map((sale) => (
              <div key={sale.id} className="p-6 flex items-center justify-between hover:bg-accent transition-colors">
                <div className="flex items-center gap-4">
                  {sale.product?.cover_image_url && (
                    <img
                      src={sale.product.cover_image_url}
                      alt={sale.product.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{sale.product?.title || 'Unknown Product'}</h3>
                    <p className="text-sm text-muted-foreground">{sale.buyer_email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(sale.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-sky-500">${Number(sale.amount).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground capitalize">{sale.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
