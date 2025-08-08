"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, LogIn, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // Redirect flow avoids JSON parse issues
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        // We will manually redirect on success for a more controlled UX
      })
      if (res?.error) {
        setError(res.error)
      } else {
        window.location.href = "/templates"
      }
    } catch (err: any) {
      setError(err?.message ?? "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <div className="mb-8 flex items-center gap-2 text-sm">
        <Sparkles className="h-4 w-4 text-[#00DC00]" />
        <span>{"Prompt it. Paste it. Post it."}</span>
      </div>
      <h1 className="mb-2 text-3xl font-bold" style={{ fontFamily: `'Funnel Display', system-ui, sans-serif` }}>
        Log in
      </h1>
      <p className="mb-6 text-black/70">Use email/password or continue with Google.</p>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full bg-[#00DC00] text-black hover:bg-[#00C800]" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
          Log in
        </Button>
      </form>

      <div className="my-6">
        <Separator />
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => signIn("google", { callbackUrl: "/templates" })}
      >
        <Mail className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link href="/auth/signup" className="underline">
          Create an account
        </Link>
        <Link href="/templates" className="underline">
          Continue as guest
        </Link>
      </div>
    </main>
  )
}
