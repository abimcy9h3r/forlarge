"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [tags, setTags] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      let fileUrl = ""
      let coverImageUrl = ""

      if (file) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const { data: fileData, error: fileError } = await supabase.storage
          .from("products")
          .upload(fileName, file)

        if (fileError) throw fileError
        
        const { data: { publicUrl } } = supabase.storage
          .from("products")
          .getPublicUrl(fileName)
        
        fileUrl = publicUrl
      }

      if (coverImage) {
        const imageExt = coverImage.name.split(".").pop()
        const imageName = `${user.id}/covers/${Date.now()}.${imageExt}`
        const { data: imageData, error: imageError } = await supabase.storage
          .from("products")
          .upload(imageName, coverImage)

        if (imageError) throw imageError
        
        const { data: { publicUrl } } = supabase.storage
          .from("products")
          .getPublicUrl(imageName)
        
        coverImageUrl = publicUrl
      }

      const { error: insertError } = await supabase
        .from("products")
        .insert({
          creator_id: user.id,
          title,
          description,
          price: parseFloat(price),
          file_url: fileUrl,
          cover_image_url: coverImageUrl,
          tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
          is_published: false,
        })

      if (insertError) throw insertError

      router.push("/dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-8 py-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-sky-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-8 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-tight">Upload New Product</h1>
          <p className="text-muted-foreground font-light mt-2">Add your digital product to start selling</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm font-light">
              {error}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-light">Product Details</CardTitle>
              <CardDescription className="font-light">Basic information about your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-light">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Dark Trap Beat Pack"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="font-light"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-light">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="font-light"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="font-light">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="9.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="font-light"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="font-light">Tags</Label>
                <Input
                  id="tags"
                  placeholder="trap, dark, beats (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="font-light"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-light">Files</CardTitle>
              <CardDescription className="font-light">Upload your product file and cover image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file" className="font-light">Product File</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-sky-500/50 transition-colors">
                  <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                    className="font-light"
                  />
                  {file && (
                    <p className="text-sm text-muted-foreground font-light mt-2">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage" className="font-light">Cover Image (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-sky-500/50 transition-colors">
                  <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    className="font-light"
                  />
                  {coverImage && (
                    <p className="text-sm text-muted-foreground font-light mt-2">
                      Selected: {coverImage.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-sky-500 hover:bg-sky-600 text-white font-light"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Product"
              )}
            </Button>
            <Link href="/dashboard">
              <Button type="button" variant="outline" className="font-light">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
