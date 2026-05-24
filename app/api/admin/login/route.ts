import { NextResponse } from 'next/server'
import { createAdminToken, ADMIN_COOKIE_NAME, isProduction } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const accessToken = body?.accessToken

    if (!accessToken) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 400 })
    }

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(accessToken)
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const user = userData.user
    const { data: adminRow, error: adminErr } = await supabaseAdmin.from('admin_users').select('*').eq('email', user.email).limit(1).maybeSingle()
    if (adminErr || !adminRow || !adminRow.is_active) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = createAdminToken()
    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    return response
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('admin login error', err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
