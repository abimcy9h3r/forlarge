"use client";

import { MessageCircle, Book, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <div className="flex-1 bg-background p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground mt-1">Get help with your forlarge account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="p-3 bg-sky-500/10 rounded-lg w-fit mb-4">
              <Book className="h-6 w-6 text-sky-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Documentation</h2>
            <p className="text-muted-foreground mb-4">
              Learn how to use forlarge with our comprehensive guides
            </p>
            <Button variant="outline" className="w-full">
              View Docs
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
            <div className="p-3 bg-green-500/10 rounded-lg w-fit mb-4">
              <MessageCircle className="h-6 w-6 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Community</h2>
            <p className="text-muted-foreground mb-4">
              Join our Discord community to connect with other creators
            </p>
            <Button variant="outline" className="w-full">
              Join Discord
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Mail className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Contact Support</h2>
              <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <input
                type="text"
                placeholder="What do you need help with?"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <textarea
                placeholder="Describe your issue..."
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              />
            </div>
            <Button className="bg-sky-500 hover:bg-sky-600 text-white w-full">
              Send Message
            </Button>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">How do I receive payments?</h3>
              <p className="text-sm text-muted-foreground">
                Connect your crypto wallet in Settings → Wallet. Payments are sent directly to your wallet on-chain.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">What are the fees?</h3>
              <p className="text-sm text-muted-foreground">
                forlarge takes a 5% platform fee. You keep 95% of every sale.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">How do I upload products?</h3>
              <p className="text-sm text-muted-foreground">
                Go to Dashboard → New Product and fill in the details. Upload your files and set your price.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
