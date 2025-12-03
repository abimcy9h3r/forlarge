"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
            Forlarge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-sky-500 text-foreground/60 hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/explore"
            className="transition-colors hover:text-sky-500 text-foreground/60 hover:text-foreground"
          >
            Explore
          </Link>
          <Link
            href="/dashboard"
            className="transition-colors hover:text-sky-500 text-foreground/60 hover:text-foreground"
          >
            Dashboard
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="hidden md:inline-flex"
            asChild
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button
            className="hidden md:inline-flex bg-sky-500 hover:bg-sky-600 text-white"
            asChild
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="container flex flex-col space-y-3 px-4 py-4">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-sky-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="text-sm font-medium transition-colors hover:text-sky-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-sky-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button className="bg-sky-500 hover:bg-sky-600 text-white" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
