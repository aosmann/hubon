export const runtime = "edge"

type GenerateImagePayload = {
  prompt: string
  ratio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4"
  size?: string
  referenceImageUrl?: string | null
  editMaskUrl?: string | null
}

function sizeFromRatio(ratio?: GenerateImagePayload["ratio"], fallback?: string) {
  if (fallback && /^\d+x\d+$/.test(fallback)) return fallback
  switch (ratio) {
    case "1:1":
      return "1024x1024"
    case "16:9":
      return "1792x1024"
    case "9:16":
      return "1024x1792"
    case "4:3":
      return "1024x768"
    case "3:4":
      return "768x1024"
    default:
      return "1024x1024"
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders })
}

export async function GET() {
  return json({
    ok: true,
    usage: "POST JSON to this endpoint to generate images with gpt-image-1.",
    payload: {
      prompt: "string (required)",
      ratio: "optional: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'",
      size: "optional: 'WIDTHxHEIGHT'",
      referenceImageUrl: "optional: URL",
      editMaskUrl: "optional: URL (requires referenceImageUrl)",
    },
  })
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateImagePayload
    if (!body?.prompt?.trim()) return json({ error: "Prompt is required" }, 400)

    const size = sizeFromRatio(body.ratio, body.size)
    const openaiKey = process.env.OPENAI_API_KEY
    if (!openaiKey) return json({ error: "OPENAI_API_KEY not set" }, 500)

    const payload: Record<string, any> = {
      model: "gpt-image-1",
      prompt: body.prompt, // no server-side enhancement
      size,
    }
    if (body.referenceImageUrl) payload.image = body.referenceImageUrl
    if (body.referenceImageUrl && body.editMaskUrl) payload.mask = body.editMaskUrl

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      let details: any
      try {
        details = await res.json()
      } catch {
        details = await res.text()
      }
      return json({ error: "OpenAI error", status: res.status, details }, res.status)
    }
    const data = await res.json()

    let imageUrl: string | null = null
    try {
      const output = data?.output ?? data?.outputs ?? []
      if (Array.isArray(output) && output.length > 0) {
        const content = output[0]?.content ?? []
        const imagePart = Array.isArray(content)
          ? content.find((c: any) => c?.type === "output_image" && typeof c?.image_url === "string")
          : null
        imageUrl = imagePart?.image_url ?? null
      }
    } catch {}
    if (!imageUrl) imageUrl = data?.data?.[0]?.url ?? null

    if (!imageUrl) return json({ error: "No image URL in response", data }, 502)

    return json({ success: true, imageUrl, size })
  } catch (e: any) {
    return json({ error: e?.message ?? "Internal error" }, 500)
  }
}

function json(payload: any, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}
