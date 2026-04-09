import { NextRequest, NextResponse } from 'next/server'
import { fetchInstagramData } from '@/lib/odlClient'
import { generateWithClaude } from '@/lib/generateHoekemon'
import { startSpriteGeneration } from '@/lib/generateSprite'

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
    console.error('[ODL] Failed to fetch Instagram data:', err)
    return NextResponse.json({ error: 'Failed to fetch Instagram data' }, { status: 500 })
  }

  // 2. Generate Hoekemon with Claude
  let hoekemon
  try {
    hoekemon = await generateWithClaude(instagramData, playerName)
  } catch (err) {
    console.error('[Claude] Generation failed:', err)
    return NextResponse.json({ error: 'Hoekemon generation failed' }, { status: 500 })
  }

  // 3. Start sprite generation (non-blocking — we return the ID for polling)
  let replicateId: string | null = null
  try {
    replicateId = await startSpriteGeneration(hoekemon.visualDescription)
  } catch (err) {
    console.error('[Replicate] Sprite generation failed to start:', err)
    // Non-fatal — card renders with shimmer placeholder
  }

  return NextResponse.json({ hoekemon, replicateId })
}
