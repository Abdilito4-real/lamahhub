import { NextResponse } from 'next/server'

const PAYSTACK_API = 'https://api.paystack.co'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const reference = url.searchParams.get('reference')

  if (!reference) {
    return NextResponse.json({ error: 'Missing reference query parameter' }, { status: 400 })
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Paystack secret key is not configured' }, { status: 500 })
  }

  const response = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  })

  const data = await response.json()

  if (!data || !data.status) {
    return NextResponse.json({ error: data?.message || 'Failed to verify Paystack transaction' }, { status: 500 })
  }

  return NextResponse.json({ transaction: data.data })
}
