'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Globe, Shield, TrendingUp, Upload, DollarSign, Check, Star } from "lucide-react";
import Waves from "@/components/ui/waves";
import { Navbar } from "@/components/Navbar";


export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Waves Background Effect - Full Screen */}
      <div className="fixed inset-0 z-0">
        <Waves
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-4 sm:px-8 md:px-16 pt-32 pb-40">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="inline-block bg-sky-500/10 text-sky-500 px-6 py-2 rounded-full text-sm font-light border border-sky-500/20">
            Web3 Creator Commerce Platform
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
            Keep <span className="text-sky-500">95%</span> of your revenue.
            <br />
            Sell globally, get paid instantly.
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
            The Web3 commerce platform built for digital creators. Upload your beats, samples, and products. Start earning in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/request-access">
              <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white font-light text-base px-10 h-14">
                Request Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="font-light text-base px-10 h-14 border-sky-500/20 hover:bg-sky-500/10">
              Explore Products
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-sm text-muted-foreground font-light">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-sky-500" />
              <span>No monthly fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-sky-500" />
              <span>Instant payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-sky-500" />
              <span>Global reach</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 border-y border-border bg-muted/20">
        <div className="container mx-auto px-4 sm:px-8 md:px-16 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-light text-sky-500">10k+</div>
              <div className="text-sm text-muted-foreground font-light">Active Creators</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-light text-sky-500">$2M+</div>
              <div className="text-sm text-muted-foreground font-light">Creator Earnings</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-light text-sky-500">50k+</div>
              <div className="text-sm text-muted-foreground font-light">Products Sold</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-light text-sky-500">95%</div>
              <div className="text-sm text-muted-foreground font-light">Revenue Share</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 container mx-auto px-4 sm:px-8 md:px-16 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-5xl md:text-6xl font-light tracking-tight">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Powerful tools designed for modern creators. No technical knowledge required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-sky-500" />
              </div>
              <h3 className="text-2xl font-light">Instant Payments</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Get paid immediately when someone purchases your product. No waiting periods or holds.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-sky-500" />
              </div>
              <h3 className="text-2xl font-light">Global Access</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Reach customers worldwide with crypto payments. No geographic restrictions or currency conversions.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-sky-500" />
              </div>
              <h3 className="text-2xl font-light">Creator Owned</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                You own your content, your audience, and your revenue. No platform can take that away.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-sky-500" />
              </div>
              <h3 className="text-2xl font-light">95% Revenue Share</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Keep 95% of every sale. We only take 5% to cover infrastructure and payment processing.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-sky-500" />
              </div>
              <h3 className="text-2xl font-light">Easy Upload</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Drag and drop your files. Add descriptions with AI assistance. Set your price and publish.
              </p>
            </div>

            <div className="space-y-6">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-sky-500" />
              </div>
              <h3 className="text-2xl font-light">No Hidden Fees</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                No monthly subscriptions. No setup fees. No surprise charges. Just simple, transparent pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 bg-muted/20 py-32">
        <div className="container mx-auto px-4 sm:px-8 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24 space-y-6">
              <h2 className="text-5xl md:text-6xl font-light tracking-tight">
                How it works
              </h2>
              <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                Start selling in minutes. No complicated setup required.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-20">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-sky-500 text-white flex items-center justify-center text-3xl font-light mx-auto">
                  1
                </div>
                <h3 className="text-2xl font-light">Create Your Account</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Sign up in seconds and set up your creator profile. No credit card required.
                </p>
              </div>

              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-sky-500 text-white flex items-center justify-center text-3xl font-light mx-auto">
                  2
                </div>
                <h3 className="text-2xl font-light">Upload Your Products</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Upload your beats, samples, or digital products. Add descriptions and set your price.
                </p>
              </div>

              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-sky-500 text-white flex items-center justify-center text-3xl font-light mx-auto">
                  3
                </div>
                <h3 className="text-2xl font-light">Start Earning</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Share your storefront and get paid instantly when customers purchase your products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 container mx-auto px-4 sm:px-8 md:px-16 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-5xl md:text-6xl font-light tracking-tight">
              Loved by creators worldwide
            </h2>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Join thousands of creators who are already earning more with Forlarge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="border border-border rounded-2xl p-8 space-y-6 hover:border-sky-500/50 transition-colors">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-sky-500 text-sky-500" />
                ))}
              </div>
              <p className="text-muted-foreground font-light leading-relaxed">
                "Forlarge changed my life. I went from struggling to make ends meet to earning a full-time income from my beats. The 95% revenue share is unbeatable."
              </p>
              <div className="flex items-center gap-4">
                <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&q=80" alt="Creator" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-light">Marcus Chen</div>
                  <div className="text-sm text-muted-foreground font-light">Music Producer</div>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-2xl p-8 space-y-6 hover:border-sky-500/50 transition-colors">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-sky-500 text-sky-500" />
                ))}
              </div>
              <p className="text-muted-foreground font-light leading-relaxed">
                "The instant payouts are incredible. I don't have to wait weeks to get my money. Plus, the platform is so easy to use, I had my store up in 10 minutes."
              </p>
              <div className="flex items-center gap-4">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" alt="Creator" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-light">Sarah Johnson</div>
                  <div className="text-sm text-muted-foreground font-light">Sound Designer</div>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-2xl p-8 space-y-6 hover:border-sky-500/50 transition-colors">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-sky-500 text-sky-500" />
                ))}
              </div>
              <p className="text-muted-foreground font-light leading-relaxed">
                "Finally, a platform that respects creators. No hidden fees, no complicated terms. Just upload your work and start earning. It's that simple."
              </p>
              <div className="flex items-center gap-4">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Creator" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-light">Alex Rivera</div>
                  <div className="text-sm text-muted-foreground font-light">Beat Maker</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 bg-gradient-to-br from-sky-500/10 via-background to-background py-32">
        <div className="container mx-auto px-4 sm:px-8 md:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-5xl md:text-6xl font-light tracking-tight">
              Ready to take control of your revenue?
            </h2>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Join thousands of creators who are already earning more with Forlarge. Start selling today, completely free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link href="/request-access">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white font-light h-14 px-8 whitespace-nowrap">
                  Request Beta Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground font-light">
              No credit card required. Start selling in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 sm:px-8 md:px-16 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <div className="text-2xl font-light">forlarge</div>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                The Web3 commerce platform built for digital creators.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-light">Product</h4>
              <div className="space-y-3 text-sm font-light text-muted-foreground">
                <div><Link href="#features" className="hover:text-sky-500 transition-colors">Features</Link></div>
                <div><Link href="#how-it-works" className="hover:text-sky-500 transition-colors">How It Works</Link></div>
                <div><Link href="/pricing" className="hover:text-sky-500 transition-colors">Pricing</Link></div>
                <div><Link href="/explore" className="hover:text-sky-500 transition-colors">Explore</Link></div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-light">Company</h4>
              <div className="space-y-3 text-sm font-light text-muted-foreground">
                <div><Link href="/about" className="hover:text-sky-500 transition-colors">About</Link></div>
                <div><Link href="/blog" className="hover:text-sky-500 transition-colors">Blog</Link></div>
                <div><Link href="/careers" className="hover:text-sky-500 transition-colors">Careers</Link></div>
                <div><Link href="/contact" className="hover:text-sky-500 transition-colors">Contact</Link></div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-light">Legal</h4>
              <div className="space-y-3 text-sm font-light text-muted-foreground">
                <div><Link href="/privacy" className="hover:text-sky-500 transition-colors">Privacy Policy</Link></div>
                <div><Link href="/terms" className="hover:text-sky-500 transition-colors">Terms of Service</Link></div>
                <div><Link href="/cookies" className="hover:text-sky-500 transition-colors">Cookie Policy</Link></div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-light">
            <div>© 2026 Forlarge. All rights reserved.</div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-sky-500 transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-sky-500 transition-colors">Discord</Link>
              <Link href="#" className="hover:text-sky-500 transition-colors">GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
