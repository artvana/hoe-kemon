import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
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
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[ODL] Failed to fetch Instagram data:', msg)
    return NextResponse.json({ error: `ODL fetch failed: ${msg}` }, { status: 500 })
  }

  // 2. Generate Hoekemon with Claude (includes basePokemon for img2img)
  let hoekemon
  try {
    hoekemon = await generateWithClaude(instagramData, playerName)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[Claude] Generation failed:', msg)
    return NextResponse.json({ error: `Hoekemon generation failed: ${msg}` }, { status: 500 })
  }

  // 3. Start img2img sprite using the base Pokémon Claude picked.
  //    The PokeAPI official artwork is used as init_image so the creature
  //    inherits the base silhouette, then the prompt drives the transformation.
  //    Non-fatal — card renders with shimmer placeholder on failure.
  let replicateId: string | null = null
  try {
    replicateId = await startSpriteGeneration(
      hoekemon.visualDescription,
      hoekemon.name,
      hoekemon.type1,
      hoekemon.basePokemon
    )
  } catch (err) {
    console.error('[Replicate] Sprite generation failed to start:', err)
  }

  return NextResponse.json({ hoekemon, replicateId })
}
