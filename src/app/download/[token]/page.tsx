'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function DownloadPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [downloadAccess, setDownloadAccess] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    validateAccess();
  }, [params.token]);

  async function validateAccess() {
    try {
      const supabase = createClient();
      
      // Get download access
      const { data: access, error: accessError } = await supabase
        .from('download_access')
        .select('*, products(*)')
        .eq('access_token', params.token)
        .single();

      if (accessError || !access) {
        setError('Invalid or expired download link');
        setLoading(false);
        return;
      }

      // Check if expired
      const expiresAt = new Date(access.expires_at);
      if (expiresAt < new Date()) {
        setError('This download link has expired');
        setLoading(false);
        return;
      }

      // Check download limit
      if (access.download_count >= access.max_downloads) {
        setError('Download limit reached for this purchase');
        setLoading(false);
        return;
      }

      setDownloadAccess(access);
      setProduct(access.products);
    } catch (error) {
      console.error('Validation error:', error);
      setError('Failed to validate download access');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!downloadAccess || !product) return;

    setDownloading(true);

    try {
      const supabase = createClient();

      // Increment download count
      const { error: updateError } = await supabase
        .from('download_access')
        .update({
          download_count: downloadAccess.download_count + 1
        })
        .eq('id', downloadAccess.id);

      if (updateError) throw updateError;

      // Handle different file types
      if (product.file_type === 'external') {
        // Redirect to external URL
        window.open(product.external_file_url, '_blank');
      } else {
        // Download from Supabase Storage
        const { data: fileData } = await supabase.storage
          .from('products')
          .download(product.file_url);

        if (fileData) {
          const url = URL.createObjectURL(fileData);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${product.title}.${product.file_url.split('.').pop()}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }

      // Refresh access data
      await validateAccess();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>{error}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/explore">
              <Button className="w-full">Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const remainingDownloads = downloadAccess.max_downloads - downloadAccess.download_count;
  const expiresAt = new Date(downloadAccess.expires_at);
  const hoursRemaining = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60));

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <CardTitle className="font-light">Download Ready</CardTitle>
                <CardDescription>Your purchase is ready to download</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Info */}
            <div className="space-y-4">
              {product.cover_image_url && (
                <img
                  src={product.cover_image_url}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-xl font-medium">{product.title}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
            </div>

            {/* Download Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Download className="h-4 w-4" />
                  Downloads Remaining
                </div>
                <p className="text-2xl font-light">{remainingDownloads} / {downloadAccess.max_downloads}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Time Remaining
                </div>
                <p className="text-2xl font-light">{hoursRemaining}h</p>
              </div>
            </div>

            {/* Download Button */}
            <Button
              onClick={handleDownload}
              disabled={downloading || remainingDownloads === 0}
              className="w-full h-12 bg-sky-500 hover:bg-sky-600"
            >
              {downloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download {product.title}
                </>
              )}
            </Button>

            {/* Info Box */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                <strong>Important:</strong> This download link expires in {hoursRemaining} hours and can be used {remainingDownloads} more time{remainingDownloads !== 1 ? 's' : ''}. Save your file in a secure location.
              </p>
            </div>

            {/* File Info */}
            {product.file_size_mb && (
              <div className="text-sm text-muted-foreground text-center">
                File size: {product.file_size_mb.toFixed(2)} MB
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
