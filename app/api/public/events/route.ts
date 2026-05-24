import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (error) throw error

    return NextResponse.json({ events: data || [] })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch events:', err)
    return NextResponse.json({ events: [] }, { status: 200 })
  }
}
