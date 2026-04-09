import { NextRequest, NextResponse } from 'next/server'
import { createConnectSession } from '@/lib/odlClient'

export async function POST(req: NextRequest) {
  const host = req.headers.get('host') ?? 'localhost:3000'
  const proto = host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https'
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? `${proto}://${host}`

  try {
    const session = await createConnectSession(origin)
    return NextResponse.json({ connectUrl: session.connectUrl })
  } catch (err) {
    console.error('[ODL] Session creation failed:', err)
    return NextResponse.json({ error: 'Session creation failed' }, { status: 500 })
  }
}
