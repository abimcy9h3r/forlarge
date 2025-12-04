import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, TrendingUp, DollarSign, Eye, Download } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: products, count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false })

  const { data: sales, count: totalSales } = await supabase
    .from("sales")
    .select("*, products!inner(*)", { count: "exact" })
    .eq("products.creator_id", user.id)
    .eq("payment_status", "completed")

  const totalRevenue = sales?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0
  const totalViews = products?.reduce((sum, product) => sum + (product.views || 0), 0) || 0
  const totalDownloads = products?.reduce((sum, product) => sum + (product.downloads || 0), 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-tight">
            forlarge
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/products">
              <Button variant="ghost" className="font-light">Products</Button>
            </Link>
            <Link href="/dashboard/sales">
              <Button variant="ghost" className="font-light">Sales</Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="ghost" className="font-light">Analytics</Button>
            </Link>
            <form action={async () => {
              "use server"
              const supabase = await createClient()
              await supabase.auth.signOut()
              redirect("/")
            }}>
              <Button variant="ghost" className="font-light" type="submit">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-8 py-12 space-y-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light tracking-tight">Welcome back, {profile?.full_name || "Creator"}</h1>
            <p className="text-muted-foreground font-light mt-2">Here's what's happening with your store</p>
          </div>
          <Link href="/dashboard/products/new">
            <Button className="bg-sky-500 hover:bg-sky-600 text-white font-light">
              <Plus className="w-4 h-4 mr-2" />
              Upload Product
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="font-light">Total Revenue</CardDescription>
              <CardTitle className="text-3xl font-light">${totalRevenue.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-light">
                <DollarSign className="w-4 h-4 text-sky-500" />
                <span>95% is yours</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="font-light">Total Sales</CardDescription>
              <CardTitle className="text-3xl font-light">{totalSales || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-light">
                <TrendingUp className="w-4 h-4 text-sky-500" />
                <span>All time</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="font-light">Total Views</CardDescription>
              <CardTitle className="text-3xl font-light">{totalViews}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-light">
                <Eye className="w-4 h-4 text-sky-500" />
                <span>Product views</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="font-light">Total Products</CardDescription>
              <CardTitle className="text-3xl font-light">{totalProducts || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-light">
                <Download className="w-4 h-4 text-sky-500" />
                <span>Published</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-light mb-6">Recent Products</h2>
          {products && products.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
                <Card key={product.id} className="hover:border-sky-500/50 transition-colors">
                  <CardHeader>
                    {product.cover_image_url && (
                      <img
                        src={product.cover_image_url}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <CardTitle className="font-light">{product.title}</CardTitle>
                    <CardDescription className="font-light line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-light text-sky-500">${product.price}</span>
                      <Link href={`/dashboard/products/${product.id}`}>
                        <Button variant="outline" size="sm" className="font-light">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground font-light mb-4">No products yet</p>
                <Link href="/dashboard/products/new">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white font-light">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Your First Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
