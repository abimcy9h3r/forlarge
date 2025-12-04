import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, ShoppingCart, Eye, Download } from "lucide-react"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      profiles:creator_id (
        id,
        full_name,
        username,
        avatar_url,
        bio
      )
    `)
    .eq("id", params.id)
    .eq("is_published", true)
    .single()

  if (!product) {
    notFound()
  }

  await supabase
    .from("products")
    .update({ views: (product.views || 0) + 1 })
    .eq("id", params.id)

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-tight">
            forlarge
          </Link>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link href="/explore">
              <Button variant="ghost" className="font-light">Explore</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="font-light">Log In</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-8 py-12">
        <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-sky-500 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            {product.cover_image_url ? (
              <img
                src={product.cover_image_url}
                alt={product.title}
                className="w-full aspect-square object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full aspect-square bg-muted rounded-2xl flex items-center justify-center">
                <span className="text-muted-foreground font-light">No image</span>
              </div>
            )}

            {product.preview_url && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-light mb-4">Audio Preview</h3>
                  <audio controls className="w-full">
                    <source src={product.preview_url} />
                  </audio>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-light tracking-tight">{product.title}</h1>
              
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="font-light">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6 text-sm text-muted-foreground font-light">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{product.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>{product.downloads || 0} downloads</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-5xl font-light text-sky-500">${product.price}</div>
              <Button size="lg" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-light h-14">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Purchase Now
              </Button>
              <p className="text-sm text-muted-foreground font-light text-center">
                Instant download after purchase
              </p>
            </div>

            {product.description && (
              <div className="space-y-4 pt-8 border-t border-border">
                <h2 className="text-2xl font-light">Description</h2>
                <p className="text-muted-foreground font-light leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {product.profiles && (
              <Card className="border-sky-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {product.profiles.avatar_url && (
                      <img
                        src={product.profiles.avatar_url}
                        alt={product.profiles.full_name || "Creator"}
                        className="w-16 h-16 rounded-full"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-light">
                        {product.profiles.full_name || product.profiles.username}
                      </h3>
                      {product.profiles.bio && (
                        <p className="text-sm text-muted-foreground font-light">
                          {product.profiles.bio}
                        </p>
                      )}
                      <Link href={`/creators/${product.profiles.id}`}>
                        <Button variant="outline" size="sm" className="font-light">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
