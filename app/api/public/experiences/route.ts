import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('experiences')
      .select('*')
      .order('id', { ascending: true })

    if (error) throw error

    return NextResponse.json({ experiences: data || [] })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch experiences:', err)
    return NextResponse.json({ experiences: [] }, { status: 200 })
  }
}
