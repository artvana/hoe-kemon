import { NextResponse } from 'next/server'
import Replicate from 'replicate'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
const VERSION = 'ff6cc781634191dd3c49097a615d2fc01b0a8aae31c448e55039a04dcbf36bba'

// Two HOE-KEMON title screen mascots — camp, slutty, fabulous
const MASCOT_PROMPTS = [
  'a fierce ghost pokemon in a floor-length sequined gown, 6-inch platform heels, enormous feather boa, dramatic smoky eye makeup, sassy fabulous pose',
  'a psychic pokemon in a glittering rhinestone bodysuit, thigh-high latex boots, acrylic nails, dramatic hair, pouty lips, glamorous drag queen energy',
]

// Warm-instance cache — survives multiple requests to same Lambda
let cache: string[] | null = null

export async function GET() {
  if (cache) return NextResponse.json({ urls: cache })

  try {
    const results = await Promise.all(
      MASCOT_PROMPTS.map((prompt) =>
        replicate.run(`lambdal/text-to-pokemon:${VERSION}`, {
          input: {
            prompt,
            num_outputs: 1,
            num_inference_steps: 25,
            guidance_scale: 7.5,
          },
        })
      )
    )

    // SDK v1 wraps outputs in FileOutput objects — toString() returns the URL
    const urls = results.map((r) => (Array.isArray(r) ? String(r[0]) : String(r))) as string[]
    cache = urls
    return NextResponse.json({ urls })
  } catch (err) {
    console.error('[Mascots]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
