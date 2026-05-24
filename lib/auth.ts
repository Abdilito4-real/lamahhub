import crypto from 'crypto'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lamah2024'
const ADMIN_COOKIE_SECRET = process.env.ADMIN_COOKIE_SECRET || 'lamahhub-default-secret'
export const ADMIN_COOKIE_NAME = 'lamahhub_admin_auth'
export const isProduction = process.env.NODE_ENV === 'production'

const base64UrlEncode = (value: string) =>
  Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const base64UrlDecode = (value: string) =>
  Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')

export const createAdminToken = () => {
  const payload = JSON.stringify({ authenticated: true, ts: Date.now() })
  const signature = crypto.createHmac('sha256', ADMIN_COOKIE_SECRET).update(payload).digest('base64')
  const token = `${base64UrlEncode(payload)}.${base64UrlEncode(signature)}`
  return token
}

export const verifyAdminToken = (token?: string | null) => {
  if (!token) return false
  const [encodedPayload, encodedSignature] = token.split('.')
  if (!encodedPayload || !encodedSignature) return false

  try {
    const payload = base64UrlDecode(encodedPayload)
    const signature = base64UrlDecode(encodedSignature)
    const expected = crypto.createHmac('sha256', ADMIN_COOKIE_SECRET).update(payload).digest('base64')
    if (signature !== expected) return false
    const data = JSON.parse(payload)
    return data?.authenticated === true
  } catch {
    return false
  }
}

export const isAdminPassword = (password: string) => password === ADMIN_PASSWORD
