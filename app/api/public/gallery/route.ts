import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('gallery_images')
      .select('*')
      .order('id', { ascending: true })

    if (error) throw error

    return NextResponse.json({ gallery: data || [] })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch gallery:', err)
    return NextResponse.json({ gallery: [] }, { status: 200 })
  }
}
