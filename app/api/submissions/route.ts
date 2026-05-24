import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

type Submission = {
  id?: string
  reference: string
  type: 'event' | 'membership' | 'booking' | 'other'
  item_id: string
  title: string
  name: string
  email: string
  phone: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  qr_text: string
  checked_in?: boolean
  check_in_at?: string
  created_at?: string
  updated_at?: string
  payload?: any
}

const genId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return Math.random().toString(36).slice(2, 12)
}

export async function GET() {
  try {
    const { data: submissions, error } = await supabaseAdmin.from('submissions').select('*').order('created_at', { ascending: false })
    if (error) return NextResponse.json({ submissions: [] })
    return NextResponse.json({ submissions })
  } catch (err) {
    return NextResponse.json({ submissions: [] })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

    // Handle both camelCase and snake_case field names
    const {
      reference,
      type,
      itemId,
      item_id,
      title,
      name,
      email,
      phone,
      amount,
      status,
      qrText,
      qr_text,
      payload,
    } = body as any

    // Use snake_case values if available, otherwise use camelCase
    const finalItemId = item_id ?? itemId ?? ''
    const finalQrText = qr_text ?? qrText ?? ''

    if (!reference || !type || !finalItemId || !title || !name || !email || !phone || amount === undefined || amount === null || !status || !finalQrText) {
      return NextResponse.json({ 
        error: 'Missing required submission fields',
        received: { reference, type, finalItemId, title, name, email, phone, amount, status, finalQrText }
      }, { status: 400 })
    }

    const id = body.id || genId()
    const record = {
      id,
      reference,
      type,
      item_id: finalItemId,
      title,
      name,
      email,
      phone,
      amount,
      status,
      qr_text: finalQrText,
      payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from('submissions').upsert(record, { onConflict: 'reference' }).select()
    if (error) {
      console.error('submission upsert error:', error)
      return NextResponse.json({ error: 'db_error', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ submission: data && Array.isArray(data) ? data[0] : record })
  } catch (err) {
    console.error('submission post error:', err)
    return NextResponse.json({ error: 'failed', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
