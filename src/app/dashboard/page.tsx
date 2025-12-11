"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
  Bell,
  User,
  Activity,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/login");
      return;
    }

    setUser(user);
    await loadStats(user.id);
    setLoading(false);
  }

  async function loadStats(userId: string) {
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
    
    setStats({
      totalSales,
      totalViews,
      totalProducts,
      totalOrders
    });
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background p-6 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to your dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>
          <ThemeToggle />
          <button className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-sky-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-sky-500" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-muted-foreground mb-1">Total Sales</h3>
          <p className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>
        
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Activity className="h-5 w-5 text-green-500" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-muted-foreground mb-1">Total Views</h3>
          <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">+5% from last week</p>
        </div>
        
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-purple-500" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-muted-foreground mb-1">Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
          <p className="text-sm text-green-600 mt-1">+8% from yesterday</p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Package className="h-5 w-5 text-orange-500" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <h3 className="font-medium text-muted-foreground mb-1">Products</h3>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
          <p className="text-sm text-green-600 mt-1">+3 new this week</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <button className="text-sm text-sky-500 hover:text-sky-600 font-medium">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {stats.totalOrders === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No activity yet. Start by creating your first product!
                </div>
              ) : [
                { icon: DollarSign, title: "New sale recorded", desc: "Order #1234 completed", time: "2 min ago", color: "green" },
                { icon: Users, title: "New user registered", desc: "john.doe@example.com joined", time: "5 min ago", color: "blue" },
                { icon: Package, title: "Product updated", desc: "Beat Pack Vol. 1 stock updated", time: "10 min ago", color: "purple" },
                { icon: Activity, title: "System maintenance", desc: "Scheduled backup completed", time: "1 hour ago", color: "orange" },
                { icon: Bell, title: "New notification", desc: "Marketing campaign results", time: "2 hours ago", color: "red" },
              ].slice(0, Math.min(5, stats.totalOrders)).map((activity, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className={`p-2 rounded-lg ${
                    activity.color === 'green' ? 'bg-green-500/10' :
                    activity.color === 'blue' ? 'bg-sky-500/10' :
                    activity.color === 'purple' ? 'bg-purple-500/10' :
                    activity.color === 'orange' ? 'bg-orange-500/10' :
                    'bg-red-500/10'
                  }`}>
                    <activity.icon className={`h-4 w-4 ${
                      activity.color === 'green' ? 'text-green-500' :
                      activity.color === 'blue' ? 'text-sky-500' :
                      activity.color === 'purple' ? 'text-purple-500' :
                      activity.color === 'orange' ? 'text-orange-500' :
                      'text-red-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.desc}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <span className="text-sm font-medium">3.2%</span>
              </div>
              <div className="w-full bg-accent rounded-full h-2">
                <div className="bg-sky-500 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bounce Rate</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-accent rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Page Views</span>
                <span className="text-sm font-medium">8.7k</span>
              </div>
              <div className="w-full bg-accent rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            <div className="space-y-3">
              {stats.totalProducts === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No products yet</p>
              ) : (
                ['Beat Pack Vol. 1', 'Drum Kit Pro', 'Melody Loops', 'Vocal Samples'].slice(0, stats.totalProducts).map((product, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">{product}</span>
                    <span className="text-sm font-medium">
                      ${Math.floor(Math.random() * 100 + 20)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
