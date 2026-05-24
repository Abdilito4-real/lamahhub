import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('membership_tiers')
      .select('*')
      .order('price', { ascending: true })

    if (error) throw error

    return NextResponse.json({ tiers: data || [] })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch membership tiers:', err)
    return NextResponse.json({ tiers: [] }, { status: 200 })
  }
}
