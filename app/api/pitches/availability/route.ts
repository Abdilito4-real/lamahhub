import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('pitches')
      .select('id, name, type, available')
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ pitches: data || [] })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load pitch availability', error)
    return NextResponse.json({ error: 'Failed to load pitch availability' }, { status: 500 })
  }
}
