import Link from "next/link"
import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

async function getTemplates() {
  // Fetch through our API to avoid client env access
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/templates`, {
    // In the preview, relative fetch is fine:
    // But using absolute if NEXT_PUBLIC_BASE_URL provided.
    cache: "no-store",
  }).catch(() => null)

  if (!res || !res.ok) {
    // Fallback: return a minimal built-in template list if API fails
    return [
      {
        slug: "hubon-minimal-1x1",
        title: "Hubon Minimal — 1:1",
        category: "social",
        ratios: ["1:1"],
      },
    ]
  }
  return res.json()
}

function TemplateSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-lg bg-black/5" />
      ))}
    </div>
  )
}

export default async function TemplatesPage() {
  const templates = await getTemplates()

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ fontFamily: `'Funnel Display', system-ui, sans-serif` }}>
          Templates
        </h1>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild className="bg-[#00DC00] text-black hover:bg-[#00C800]">
            <Link href="/auth/login">Log in</Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<TemplateSkeleton />}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates?.map((t: any) => (
            <Card key={t.slug} className="group overflow-hidden border-black/10">
              <CardHeader>
                <CardTitle className="text-lg">{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3 text-xs text-black/60">
                  {t.category} • {Array.isArray(t.ratios) ? t.ratios.join(", ") : ""}
                </div>
                <div className="aspect-square w-full rounded-md bg-[url('/minimal-flyer-mockup.png')] bg-cover bg-center" />
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link href={`/templates/${t.slug}`}>Use template</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Suspense>
    </main>
  )
}
