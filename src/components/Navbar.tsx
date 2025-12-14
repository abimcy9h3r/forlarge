'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Desktop Navigation - Floating Capsule */}
      <nav className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        isNavVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
      } hidden md:block`}>
        <div className="flex items-center gap-10 px-8 py-2 rounded-full bg-background/80 backdrop-blur-lg border border-border shadow-lg">
          <Link href="/" className="text-base font-light tracking-tight hover:text-sky-500 transition-colors">
            forlarge
          </Link>
          
          <div className="h-4 w-px bg-border" />
          
          <div className="flex items-center gap-2 text-xs font-light">
            <Link href="/#features" className="hover:text-sky-500 transition-colors px-3.5 py-1.5 rounded-full hover:bg-sky-500/10 whitespace-nowrap">Features</Link>
            <Link href="/#how-it-works" className="hover:text-sky-500 transition-colors px-3.5 py-1.5 rounded-full hover:bg-sky-500/10 whitespace-nowrap">How It Works</Link>
            <Link href="/#testimonials" className="hover:text-sky-500 transition-colors px-3.5 py-1.5 rounded-full hover:bg-sky-500/10 whitespace-nowrap">Testimonials</Link>
            <Link href="/explore" className="hover:text-sky-500 transition-colors px-3.5 py-1.5 rounded-full hover:bg-sky-500/10">Explore</Link>
          </div>
          
          <div className="h-4 w-px bg-border" />
          
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <ConnectWalletButton />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-light rounded-full h-7 px-3.5 whitespace-nowrap">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white font-light rounded-full h-7 px-3.5 text-xs whitespace-nowrap">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-light tracking-tight hover:text-sky-500 transition-colors">
            forlarge
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ConnectWalletButton />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 p-0"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background/95 backdrop-blur-lg">
            <div className="flex flex-col p-4 space-y-2">
              <Link 
                href="/#features" 
                className="px-4 py-2 text-sm font-light hover:text-sky-500 hover:bg-sky-500/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/#how-it-works" 
                className="px-4 py-2 text-sm font-light hover:text-sky-500 hover:bg-sky-500/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="/#testimonials" 
                className="px-4 py-2 text-sm font-light hover:text-sky-500 hover:bg-sky-500/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link 
                href="/explore" 
                className="px-4 py-2 text-sm font-light hover:text-sky-500 hover:bg-sky-500/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <div className="h-px bg-border my-2" />
              <Link 
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm font-light">
                  Log In
                </Button>
              </Link>
              <Link 
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button size="sm" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-light">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
