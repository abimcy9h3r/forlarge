"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Check, Copy } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ShareButton({ url, title }: { url?: string, title?: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        const shareUrl = url ? `${window.location.origin}${url}` : window.location.href

        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy", err)
        }
    }

    const handleNativeShare = async () => {
        const shareUrl = url ? `${window.location.origin}${url}` : window.location.href
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title || 'Check this out on Forlarge',
                    url: shareUrl
                })
            } catch (err) {
                console.error("Error sharing", err)
            }
        } else {
            handleCopy()
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
                    {copied ? (
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                        <Copy className="mr-2 h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy Link"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
