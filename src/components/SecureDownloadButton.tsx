"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Loader2, AlertCircle } from "lucide-react";

interface SecureDownloadButtonProps {
    token: string;
    fileUrl: string | null;
    externalUrl: string | null;
    fileType: 'direct' | 'external';
    fileName: string;
}

export function SecureDownloadButton({
    token,
    fileUrl,
    externalUrl,
    fileType,
    fileName
}: SecureDownloadButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDownload = async () => {
        setLoading(true);
        setError("");

        try {
            // 1. Notify server to consume token (increment count)
            // Ideally we do this via an API route that returns the final signed URL or redirects
            // For MVP, we'll hit an API endpoint that validates & increments, then returns the URL

            const response = await fetch('/api/download/consume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Download failed");
            }

            // 2. Trigger Download
            if (fileType === 'direct' && fileUrl) {
                // If direct, we might want to force download 
                // Creating a hidden link
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = fileName; // Might not work for cross-origin but worth trying
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (fileType === 'external' && externalUrl) {
                window.open(externalUrl, '_blank');
            } else {
                throw new Error("File URL missing");
            }

            // Reload page to update count?
            // window.location.reload();

        } catch (err: any) {
            console.error("Download error:", err);
            setError(err.message || "Failed to start download");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm font-light flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <Button
                onClick={handleDownload}
                disabled={loading}
                size="lg"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-light h-14 text-lg"
            >
                {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : fileType === 'external' ? (
                    <ExternalLink className="mr-2 h-5 w-5" />
                ) : (
                    <Download className="mr-2 h-5 w-5" />
                )}

                {fileType === 'external' ? 'Open Link' : 'Download File'}
            </Button>
            <p className="text-sm text-center text-muted-foreground font-light">
                Clicking will increment your download count.
            </p>
        </div>
    );
}
