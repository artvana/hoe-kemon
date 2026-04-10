import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
import { fetchInstagramData } from '@/lib/odlClient'
import { generateWithClaude } from '@/lib/generateHoekemon'
import { startSpriteGenerationFromData } from '@/lib/generateSprite'

export async function POST(req: NextRequest) {
  const { connectionId, playerName } = await req.json()

  if (!connectionId || !playerName) {
    return NextResponse.json({ error: 'Missing connectionId or playerName' }, { status: 400 })
  }

  // 1. Fetch Instagram data from ODL
  let instagramData: object
  try {
    instagramData = await fetchInstagramData(connectionId)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[ODL] Failed to fetch Instagram data:', msg)
    return NextResponse.json({ error: `ODL fetch failed: ${msg}` }, { status: 500 })
  }

  // 2. Run Claude + Replicate in parallel.
  //    The generic sprite starts generating immediately while Claude thinks (~15-20s).
  //    By the time the pokédex dialogue finishes, the sprite is likely done.
  let hoekemon
  let replicateId: string | null = null

  try {
    const [claudeResult, spriteId] = await Promise.allSettled([
      generateWithClaude(instagramData, playerName),
      startSpriteGenerationFromData(instagramData, playerName),
    ])

    if (claudeResult.status === 'rejected') {
      const msg = claudeResult.reason instanceof Error ? claudeResult.reason.message : String(claudeResult.reason)
      console.error('[Claude] Generation failed:', msg)
      return NextResponse.json({ error: `Hoekemon generation failed: ${msg}` }, { status: 500 })
    }

    hoekemon = claudeResult.value

    if (spriteId.status === 'fulfilled') {
      replicateId = spriteId.value
    } else {
      console.error('[Replicate] Sprite generation failed to start:', spriteId.reason)
      // Non-fatal — card renders with shimmer placeholder
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Generation failed: ${msg}` }, { status: 500 })
  }

  return NextResponse.json({ hoekemon, replicateId })
}
