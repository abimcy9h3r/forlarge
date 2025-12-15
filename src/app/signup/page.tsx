"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      // Redirect to onboarding after successful signup
      router.push("/onboarding")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-sky-500/10 via-background to-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-sky-500 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <h1 className="text-4xl font-light tracking-tight">Create your account</h1>
          <p className="text-muted-foreground font-light">Start selling in minutes</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm font-light">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName" className="font-light">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="h-12 font-light"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-light">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 font-light"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-light">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 font-light"
            />
            <p className="text-xs text-muted-foreground font-light">Must be at least 6 characters</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white font-light"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-sm font-light text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-sky-500 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
