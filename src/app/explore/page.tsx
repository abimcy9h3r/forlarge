import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search } from "lucide-react"

export default async function ExplorePage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      profiles:creator_id (
        full_name,
        username,
        avatar_url
      )
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(12)

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-tight">
            forlarge
          </Link>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="font-light">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-sky-500 hover:bg-sky-600 text-white font-light">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-8 py-12 space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight">
            Explore Digital Products
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Discover beats, samples, and digital products from creators worldwide
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-12 h-14 font-light"
            />
          </div>
        </div>

        {products && products.length > 0 ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="hover:border-sky-500/50 transition-all hover:shadow-lg">
                  {product.cover_image_url && (
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={product.cover_image_url}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
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
                      {product.profiles && (
                        <div className="flex items-center gap-2">
                          {product.profiles.avatar_url && (
                            <img
                              src={product.profiles.avatar_url}
                              alt={product.profiles.full_name || "Creator"}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="text-sm text-muted-foreground font-light">
                            {product.profiles.full_name || product.profiles.username}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground font-light">No products available yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
