export const runtime = "edge"

type GenerateImagePayload = {
  prompt: string
  ratio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4"
  size?: string // optional direct size like "1024x1024"
  style?: string | null
  referenceImageUrl?: string | null
  editMaskUrl?: string | null
}

/**
 * Map common social ratios to pixel sizes for gpt-image-1
 */
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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateImagePayload

    if (!body?.prompt || !body.prompt.trim()) {
      return json({ error: "Prompt is required" }, 400)
    }

    // Respect "no prompt enhancement": pass user prompt as-is
    const prompt = body.prompt
    const size = sizeFromRatio(body.ratio, body.size)

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      return json({ error: "OPENAI_API_KEY is not configured" }, 500)
    }

    // Build payload for OpenAI Responses API using gpt-image-1
    // Reference: model supports base, reference, and masked edit via `image` and optional `mask`
    const openaiPayload: Record<string, any> = {
      model: "gpt-image-1",
      prompt,
      size,
    }

    if (body.referenceImageUrl) {
      openaiPayload.image = body.referenceImageUrl
    }
    if (body.referenceImageUrl && body.editMaskUrl) {
      openaiPayload.mask = body.editMaskUrl
    }

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(openaiPayload),
    })

    if (!res.ok) {
      let details: unknown
      try {
        details = await res.json()
      } catch {
        details = await res.text()
      }
      return json(
        {
          error: "OpenAI image generation failed",
          status: res.status,
          details,
        },
        res.status
      )
    }

    const data = await res.json()

    // Try to extract an image URL from Responses API output formats
    // New Responses format (content with type "output_image")
    let imageUrl: string | null = null

    try {
      // gpt-image-1 Responses payload commonly uses:
      // data.output[0].content = [{ type: "output_image", image_url: "..." }]
      const output = data?.output ?? data?.outputs ?? []
      if (Array.isArray(output) && output.length > 0) {
        const content = output[0]?.content ?? []
        const imagePart = Array.isArray(content)
          ? content.find((c: any) => c?.type === "output_image" && typeof c?.image_url === "string")
          : null
        imageUrl = imagePart?.image_url ?? null
      }
    } catch {
      // ignore and fall back
    }

    // Legacy fallback (older image APIs returned { data: [{ url }] })
    if (!imageUrl) {
      imageUrl = data?.data?.[0]?.url ?? null
    }

    if (!imageUrl) {
      return json(
        {
          error: "Could not parse image URL from OpenAI response",
          details: data,
        },
        502
      )
    }

    // We return revisedPrompt for display only; not used server-side for generation.
    const ratioLabels: Record<string, string> = {
      "1:1": "Square (1:1)",
      "16:9": "Horizontal (16:9)",
      "9:16": "Vertical (9:16)",
      "4:3": "Facebook (4:3)",
      "3:4": "Facebook (3:4)",
    }
    const ratioLabel =
      (body.ratio && ratioLabels[body.ratio]) || (body.ratio ?? "custom")

    const revisedPrompt = [prompt, ratioLabel, body.style].filter(Boolean).join(" | ")

    return json(
      {
        success: true,
        imageUrl,
        revisedPrompt,
        size,
      },
      200
    )
  } catch (err) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error"
    return json({ error: "Internal Server Error", details: message }, 500)
  }
}

function json(payload: any, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}
