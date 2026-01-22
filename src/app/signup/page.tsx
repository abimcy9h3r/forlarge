"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft } from "lucide-react"
import { validateInviteCode, useInviteCode } from "@/lib/services/waitlist"

function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const codeParam = searchParams.get('code')
    if (codeParam) {
      setCode(codeParam)
    }
  }, [searchParams])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // 1. Validate Invite Code
    if (!code) {
      setError("Invite code is required to sign up.")
      setLoading(false)
      return
    }

    const { valid, error: validateError } = await validateInviteCode(code)
    if (!valid) {
      setError(validateError || "Invalid invite code.")
      setLoading(false)
      return
    }

    // 2. Sign Up
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          invite_code: code, // Track used code in metadata
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      // 3. Mark Code as Used (Best Effort in Client)
      await useInviteCode(code)

      // Redirect to onboarding after successful signup
      router.push("/onboarding")
    }
  }

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm font-light">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="code" className="font-light">Invite Code</Label>
        <Input
          id="code"
          type="text"
          placeholder="INVITE-XXXX"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="h-12 font-light uppercase"
        />
        <p className="text-xs text-muted-foreground font-light">
          Don't have a code? <Link href="/request-access" className="text-sky-500 hover:underline">Request access</Link>
        </p>
      </div>

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
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-sky-500/10 via-background to-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-sky-500 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <h1 className="text-4xl font-light tracking-tight">Create your account</h1>
          <p className="text-muted-foreground font-light">Join via invite code</p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <SignupForm />
        </Suspense>

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
