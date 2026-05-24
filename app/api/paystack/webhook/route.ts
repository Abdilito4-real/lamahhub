import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return NextResponse.json({ error: 'Missing Paystack secret' }, { status: 500 })

  const raw = await req.text()
  const signature = req.headers.get('x-paystack-signature') || ''

  const hmac = crypto.createHmac('sha512', secret).update(raw).digest('hex')
  if (hmac !== signature) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })

  let event
  try {
    event = JSON.parse(raw)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventType = event.event
  const data = event.data

  if (eventType === 'charge.success' || data?.status === 'success') {
    const transaction = data
    const metadata = transaction.metadata ?? {}
    const reference = transaction.reference
    const amountNGN = transaction.amount ? transaction.amount / 100 : 0

    const record = {
      reference,
      type: metadata.type ?? 'other',
      item_id: metadata.itemId ?? '',
      title: metadata.title ?? 'Payment',
      name: metadata.name ?? '',
      email: transaction.customer?.email ?? metadata.email ?? '',
      phone: metadata.phone ?? '',
      amount: amountNGN,
      status: 'success',
      qr_text: `LAMAHHUB:${reference}`,
      payload: transaction,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    try {
      const { data: upserted, error } = await supabaseAdmin.from('submissions').upsert(record, { onConflict: 'reference' }).select()
      if (error) {
        // eslint-disable-next-line no-console
        console.error('supabase upsert error', error)
        return NextResponse.json({ error: 'db_error' }, { status: 500 })
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('webhook error', err)
      return NextResponse.json({ error: 'failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: true })
}
