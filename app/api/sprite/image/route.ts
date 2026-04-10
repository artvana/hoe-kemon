import { NextRequest, NextResponse } from 'next/server'

// Proxy Replicate image URLs server-side to bypass CORS restrictions.
// Usage: /api/sprite/image?url=<encoded-replicate-url>
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  try {
    const upstream = await fetch(url, { cache: 'no-store' })
    if (!upstream.ok) {
      return NextResponse.json({ error: `Upstream ${upstream.status}` }, { status: 502 })
    }

    const contentType = upstream.headers.get('content-type') ?? 'image/png'
    const body = await upstream.arrayBuffer()

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (err) {
    console.error('[ImageProxy] Failed:', err)
    return NextResponse.json({ error: 'Proxy fetch failed' }, { status: 502 })
  }
}
