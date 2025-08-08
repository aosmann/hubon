import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  const err = searchParams?.error ?? "An unexpected error occurred."
  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>{err}</AlertDescription>
      </Alert>
      <div className="flex items-center gap-3">
        <Button asChild><Link href="/auth/login">Back to login</Link></Button>
        <Button asChild variant="outline"><Link href="/">Home</Link></Button>
      </div>
    </main>
  )
}
