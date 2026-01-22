import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/Navbar"
import { AudioPreviewPlayer } from "@/components/AudioPreviewPlayer"
import { SimilarProducts } from "@/components/SimilarProducts"
import { CreatorProducts } from "@/components/CreatorProducts"
import { PaymentButton } from "@/components/PaymentButton"
import { ShareButton } from "@/components/ShareButton"
import { ArrowLeft, ShoppingCart, Eye, Download, User } from "lucide-react"

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
        bio,
        email,
        wallet_address
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
      <Navbar />

      <div className="container mx-auto px-4 sm:px-8 py-12 md:py-16 mt-16 md:mt-0">
        <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-sky-500 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
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

            {product.preview_file_url && (
              <AudioPreviewPlayer
                audioUrl={product.preview_file_url}
                title={product.title}
              />
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
              <div className="flex items-center justify-between">
                <div className="text-5xl font-light text-sky-500">${product.price}</div>
                <ShareButton title={product.title} />
              </div>

              <PaymentButton
                productId={product.id}
                productTitle={product.title}
                price={product.price}
                sellerWalletBase={product.profiles?.wallet_address || ''}
                sellerWalletSolana={product.profiles?.wallet_address || ''}
                creatorEmail={product.profiles?.email || ''}
              />

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
                    <div className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center text-white text-xl font-light flex-shrink-0">
                      <User className="h-8 w-8" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-light">
                        {product.profiles.full_name || product.profiles.username || 'Creator'}
                      </h3>
                      {product.profiles.bio && (
                        <p className="text-sm text-muted-foreground font-light">
                          {product.profiles.bio}
                        </p>
                      )}
                      {product.profiles.username && (
                        <Link href={`/store/${product.profiles.username}`}>
                          <Button variant="outline" size="sm" className="font-light">
                            View Store
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="max-w-6xl mx-auto mt-16 pt-16 border-t border-border">
          <SimilarProducts
            currentProductId={product.id}
            category={product.category}
            tags={product.tags || []}
          />
        </div>

        {/* More from Creator Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <CreatorProducts
            creatorId={product.user_id}
            currentProductId={product.id}
          />
        </div>
      </div>
    </div>
  )
}
