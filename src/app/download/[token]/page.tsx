
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { validateDownloadToken } from "@/lib/services/download";
import { Navbar } from "@/components/Navbar";
import { SecureDownloadButton } from "@/components/SecureDownloadButton";
import { AlertTriangle, Clock, Download, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DownloadPage({ params }: { params: { token: string } }) {
  const { valid, data, error } = await validateDownloadToken(params.token);

  if (!valid || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-light">Access Denied</h1>
          <p className="text-muted-foreground font-light max-w-md">
            {error || "This download link is invalid or has expired."}
          </p>
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const product = data.products;
  const remainingDownloads = (data.max_downloads || 5) - (data.download_count || 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <h1 className="text-4xl font-light">Your Purchase is Ready</h1>
            <p className="text-muted-foreground font-light">
              Thank you for supporting the creator!
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-8 space-y-8">
              {/* Product Info */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {product.cover_image_url ? (
                  <img
                    src={product.cover_image_url}
                    alt={product.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="space-y-2">
                  <h2 className="text-2xl font-light">{product.title}</h2>
                  <p className="text-sm text-muted-foreground font-light line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm font-light">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Expires in 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Download className="w-4 h-4" />
                    <span>{remainingDownloads} downloads left</span>
                  </div>
                </div>
              </div>

              <SecureDownloadButton
                token={params.token}
                fileUrl={product.file_url}
                externalUrl={product.external_file_url}
                fileType={product.file_type as 'direct' | 'external'}
                fileName={product.title} // Or file name if available
              />
            </div>
            <div className="bg-muted/30 p-4 text-center text-xs text-muted-foreground font-light">
              Access Token: {params.token}
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground font-light max-w-sm mx-auto">
            Need help? Contact support with your transaction ID.
          </p>
        </div>
      </div>
    </div>
  );
}
