import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white text-black">
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-[#00DC00]" />
            {"Prompt it. Paste it. Post it."}
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl" style={{ fontFamily: `'Funnel Display', system-ui, sans-serif` }}>
            Hubon — creative AI for on-brand visuals
          </h1>
          <p className="max-w-2xl text-base text-black/70 md:text-lg" style={{ fontFamily: `'Archia', ui-sans-serif, system-ui` }}>
            Generate on-brand images and captions in seconds. Minimal, high-contrast, no clutter. Upload your logo and palette or try guest mode.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="bg-[#00DC00] text-black hover:bg-[#00C800]">
              <Link href="/auth/login">Start creating</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/templates" className="inline-flex items-center">
                Continue as guest
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
