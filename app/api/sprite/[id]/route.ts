import { NextRequest, NextResponse } from 'next/server'
import { getSpriteStatus } from '@/lib/generateSprite'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const result = await getSpriteStatus(id)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[Replicate] Polling failed:', err)
    return NextResponse.json({ status: 'failed' })
  }
}
