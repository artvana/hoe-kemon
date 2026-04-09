import { createClient } from '@opendatalabs/connect-js/server'

function getClient() {
  return createClient({
    apiBaseUrl: 'https://api.opendatalabs.com/api/v1',
    apiKey: process.env.OPENDATALABS_API_KEY!,
    secret: process.env.OPENDATALABS_ENCRYPTION_SECRET!,
  })
}

export async function createConnectSession(origin: string): Promise<{ connectUrl: string }> {
  const odl = getClient()
  const session = await odl.createConnectSession({
    source: 'instagram',
    scopes: ['read:user_profile', 'read:posts', 'read:engagement'],
    origin,
  })
  return session as { connectUrl: string }
}

export async function fetchInstagramData(connectionId: string): Promise<object> {
  const odl = getClient()
  const result = await odl.fetchConnectionResult(connectionId)
  return (result as { data: object }).data
}
