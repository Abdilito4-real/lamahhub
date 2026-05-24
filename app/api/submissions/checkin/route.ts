import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  if (!verifyAdminToken(token)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const reference = body?.reference
  if (!reference) return NextResponse.json({ error: 'Reference is required' }, { status: 400 })

  try {
    const update = { checked_in: true, updated_at: new Date().toISOString() }
    const { data, error } = await supabaseAdmin.from('submissions').update(update).eq('reference', reference).select()
    if (error) {
      console.error('checkin db error', error)
      return NextResponse.json({ error: error.message || 'db_error' }, { status: 500 })
    }
    if (!data || (Array.isArray(data) && data.length === 0)) return NextResponse.json({ error: 'Submission not found' }, { status: 404 })

    return NextResponse.json({ submission: Array.isArray(data) ? data[0] : data })
  } catch (err) {
    console.error('checkin route error', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'failed' }, { status: 500 })
  }
}
