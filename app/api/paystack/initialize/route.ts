import { NextResponse } from 'next/server'

const PAYSTACK_API = 'https://api.paystack.co'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, amount, name, phone, type, itemId, title, tickets, teamName, notes } = body as Record<string, any>

  if (!email || !amount || !name || !type || !itemId || !title) {
    return NextResponse.json({ error: 'Missing required payment fields' }, { status: 400 })
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Paystack secret key is not configured' }, { status: 500 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lamahhub.vercel.app'
  const callbackUrl = `${appUrl}/payment/callback`
  const metadata = {
    name,
    phone,
    type,
    itemId,
    title,
    tickets: tickets ?? '',
    teamName: teamName ?? '',
    notes: notes ?? '',
  }

  const payload = {
    email,
    amount: Math.round(Number(amount) * 100),
    currency: 'NGN',
    metadata,
    callback_url: callbackUrl,
  }

  const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!data || !data.status) {
    return NextResponse.json({ error: data?.message || 'Failed to initialize Paystack transaction' }, { status: 500 })
  }

  return NextResponse.json({ authorization_url: data.data.authorization_url, reference: data.data.reference })
}
