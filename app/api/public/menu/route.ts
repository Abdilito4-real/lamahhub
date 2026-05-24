import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    return NextResponse.json({ menu: data || [] })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch menu:', err)
    return NextResponse.json({ menu: [] }, { status: 200 })
  }
}
