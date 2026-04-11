import { NextResponse } from 'next/server'
import { warmupModel } from '@/lib/generateSprite'

export const maxDuration = 10

// Fire-and-forget: starts a dummy generation to heat the Replicate GPU.
// Called from the client on page load so the model is warm by the time
// the user finishes the Oak intro + Instagram flow (~2-3 min).
export async function POST() {
  console.log('[Warmup] Heating Replicate GPU...')
  // Don't await — return immediately, let warmup run in background
  warmupModel().then(() => console.log('[Warmup] Done')).catch(() => {})
  return NextResponse.json({ ok: true })
}
