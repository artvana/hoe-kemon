import { NextRequest, NextResponse } from 'next/server'
import { createConnectSession } from '@/lib/odlClient'

export async function POST(req: NextRequest) {
  const host = req.headers.get('host') ?? 'localhost:3000'
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? `${proto}://${host}`

  try {
    const session = await createConnectSession(origin)
    // Log the raw session so we can see the actual property names
    console.log('[ODL] Raw session response:', JSON.stringify(session))
    // Handle both connectUrl and connect_url shapes
    const connectUrl =
      (session as Record<string, unknown>).connectUrl as string |
      (session as Record<string, unknown>).connect_url as string |
      (session as Record<string, unknown>).url as string
    if (!connectUrl) {
      console.error('[ODL] No connectUrl in session:', session)
      return NextResponse.json({ error: 'No connect URL in session response', raw: session }, { status: 500 })
    }
    return NextResponse.json({ connectUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[ODL] Session creation failed:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
