"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { joinWaitlist, validateInviteCode } from "@/lib/services/waitlist"

export default function RequestAccessPage() {
    const [email, setEmail] = useState("")
    const [inviteCode, setInviteCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
    const [message, setMessage] = useState("")
    const [showInviteInput, setShowInviteInput] = useState(false)

    const router = useRouter()

    const handleJoinWaitlist = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setStatus("idle")

        // logic: if showing invite input, validate code logic
        // else, join waitlist logic

        // Just handling waitlist here primarily
        const { data, error } = await joinWaitlist(email)

        setLoading(false)
        if (error) {
            setStatus("error")
            // Check for specific unique error
            if (error.includes('already on waitlist')) {
                setMessage("You are already on the waitlist! We'll be in touch.")
            } else {
                setMessage(error || "Something went wrong. Please try again.")
            }
        } else {
            setStatus("success")
            setMessage("You've been added to the waitlist! check your email for updates.")
        }
    }

    const handleVerifyInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inviteCode) return

        setLoading(true)
        setStatus("idle")
        setMessage("")

        const { valid, error } = await validateInviteCode(inviteCode)

        setLoading(false)

        if (valid) {
            // Redirect to signup with code
            router.push(`/signup?code=${encodeURIComponent(inviteCode)}`)
        } else {
            setStatus("error")
            setMessage(error || "Invalid invite code.")
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
                    <h1 className="text-4xl font-light tracking-tight">Request Access</h1>
                    <p className="text-muted-foreground font-light">Join the exclusive beta for creators.</p>
                </div>

                {status === "success" && !showInviteInput ? (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-600 px-6 py-8 rounded-2xl text-center space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <h3 className="text-xl font-medium">You're on the list!</h3>
                        <p className="font-light">
                            We've received your request. We're rolling out access gradually to ensure the best experience for creators.
                        </p>
                        <Button variant="outline" onClick={() => router.push('/')} className="mt-4">
                            Back to Home
                        </Button>
                    </div>
                ) : (
                    <>
                        {status === "error" && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm font-light">
                                {message}
                            </div>
                        )}

                        {!showInviteInput ? (
                            <form onSubmit={handleJoinWaitlist} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-light">Email Address</Label>
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
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white font-light"
                                >
                                    {loading ? "Joining..." : "Join Waitlist"}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyInvite} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="inviteCode" className="font-light">Enter Invite Code</Label>
                                    <Input
                                        id="inviteCode"
                                        type="text"
                                        placeholder="INVITE-XXXX"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value)}
                                        required
                                        className="h-12 font-light uppercase"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white font-light"
                                >
                                    {loading ? "Verifying..." : "Redeem Code"}
                                </Button>
                            </form>
                        )}

                        <div className="text-center pt-4">
                            {!showInviteInput ? (
                                <button
                                    onClick={() => setShowInviteInput(true)}
                                    className="text-sm text-sky-500 hover:underline font-light"
                                >
                                    Have an invite code? Click here
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowInviteInput(false)}
                                    className="text-sm text-muted-foreground hover:text-foreground font-light"
                                >
                                    Return to waitlist form
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
