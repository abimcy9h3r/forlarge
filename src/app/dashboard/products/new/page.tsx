"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Loader2, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { generateSlug } from "@/lib/utils/slug"
import { validateFileSize, formatFileSize, isValidExternalUrl } from "@/lib/utils/file-validation"

export default function NewProductPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [tags, setTags] = useState("")
  const [uploadType, setUploadType] = useState<"direct" | "external">("direct")
  const [file, setFile] = useState<File | null>(null)
  const [externalFileUrl, setExternalFileUrl] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const validation = validateFileSize(selectedFile)
    if (!validation.valid) {
      setError(validation.error || "")
      setFile(null)
      return
    }

    setFile(selectedFile)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      if (uploadType === "external") {
        if (!externalFileUrl) throw new Error("Please provide an external file URL")
        if (!isValidExternalUrl(externalFileUrl)) {
          throw new Error("Please use a valid file hosting service (Mega.nz, Google Drive, Dropbox, OneDrive)")
        }
      } else {
        if (!file) throw new Error("Please select a file to upload")
      }

      const baseSlug = generateSlug(title)
      
      const { data: existingProducts } = await supabase
        .from('products')
        .select('slug')
        .eq('user_id', user.id)
      
      const existingSlugs = existingProducts?.map(p => p.slug).filter(Boolean) || []
      let slug = baseSlug
      let counter = 1
      while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
      }

      let fileUrl = ""
      let coverImageUrl = ""
      let fileSizeMB = 0

      if (uploadType === "direct" && file) {
        fileSizeMB = file.size / (1024 * 1024)
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
          user_id: user.id,
          title,
          slug,
          description,
          price: parseFloat(price),
          file_type: uploadType,
          file_url: uploadType === "direct" ? fileUrl : null,
          external_file_url: uploadType === "external" ? externalFileUrl : null,
          file_size_mb: uploadType === "direct" ? fileSizeMB : null,
          cover_image_url: coverImageUrl,
          tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
          is_published: false,
        })

      if (insertError) throw insertError

      router.push("/dashboard/products")
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 bg-background p-6 overflow-auto">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create New Product</CardTitle>
            <CardDescription>
              Add a new digital product to your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Beat Pack Vol. 1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="29.99"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="beats, hip-hop, trap"
                />
              </div>

              <div className="space-y-4">
                <Label>Product File *</Label>
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    variant={uploadType === "direct" ? "default" : "outline"}
                    onClick={() => setUploadType("direct")}
                    className={uploadType === "direct" ? "bg-sky-500 hover:bg-sky-600" : ""}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Direct Upload
                  </Button>
                  <Button
                    type="button"
                    variant={uploadType === "external" ? "default" : "outline"}
                    onClick={() => setUploadType("external")}
                    className={uploadType === "external" ? "bg-sky-500 hover:bg-sky-600" : ""}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    External Link
                  </Button>
                </div>

                {uploadType === "direct" ? (
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {file ? file.name : "Click to upload file (max 200MB)"}
                        </p>
                        {file && (
                          <p className="text-xs text-sky-500 mt-1">
                            {formatFileSize(file.size)}
                          </p>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      For files larger than 200MB, use the External Link option
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      value={externalFileUrl}
                      onChange={(e) => setExternalFileUrl(e.target.value)}
                      placeholder="https://mega.nz/file/... or Google Drive link"
                    />
                    <p className="text-xs text-muted-foreground">
                      Supported: Mega.nz, Google Drive, Dropbox, OneDrive
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover-image">Cover Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label htmlFor="cover-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {coverImage ? coverImage.name : "Click to upload cover image"}
                    </p>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
