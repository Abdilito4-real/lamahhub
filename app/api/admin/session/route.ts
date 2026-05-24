import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth'

function getCookieValue(name: string) {
  const headerValues = headers()
  const cookieHeader =
    typeof headerValues.get === 'function'
      ? headerValues.get('cookie')
      : (headerValues as any).cookie || (headerValues as any)['cookie'] || ''
  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')[1] || null
}

export async function GET() {
  const token = getCookieValue(ADMIN_COOKIE_NAME)
  const isAdmin = verifyAdminToken(token)
  return NextResponse.json({ isAdmin })
}
