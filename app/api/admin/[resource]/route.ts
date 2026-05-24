import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

const allowedResources = new Set([
  'menu_items',
  'vehicles',
  'pitches',
  'bookings',
  'events',
  'members',
  'membership_tiers',
  'gallery_images',
  'site_settings',
  'time_slots',
])

function ensureResource(resource: string) {
  if (!allowedResources.has(resource)) {
    throw new Error(`Invalid admin resource: ${resource}`)
  }
  return resource
}

async function parseJson(request: Request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { resource: string } }
) {
  try {
    const resource = ensureResource(params.resource)
    if (resource === 'site_settings') {
      const { data, error } = await supabaseAdmin.from(resource).select('*').limit(1).maybeSingle()
      if (error) throw error
      return NextResponse.json({ record: data || null })
    }

    const { data, error } = await supabaseAdmin.from(resource).select('*').order('id', { ascending: true })
    if (error) throw error

    return NextResponse.json({ records: data || [] })
  } catch (error) {
    console.error('Admin GET resource failed', error)
    return NextResponse.json({ error: 'Failed to load admin resource' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { resource: string } }
) {
  try {
    const resource = ensureResource(params.resource)
    const body = await parseJson(request)
    const item = body.item || body.data || body
    if (!item || typeof item !== 'object') {
      return NextResponse.json({ error: 'Missing admin payload' }, { status: 400 })
    }

    const useUpsert = resource === 'site_settings' || Boolean(item.id)
    const response = useUpsert
      ? await supabaseAdmin.from(resource).upsert(item, { onConflict: 'id' }).select()
      : await supabaseAdmin.from(resource).insert(item).select()

    if (response.error) throw response.error
    const data = response.data
    const record = Array.isArray(data) ? data[0] : data
    return NextResponse.json({ record })
  } catch (error) {
    console.error('Admin POST resource failed', error)
    return NextResponse.json({ error: 'Failed to save admin record' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { resource: string } }
) {
  try {
    const resource = ensureResource(params.resource)
    const body = await parseJson(request)
    const id = body.id ?? body.item?.id
    const payload = body.item || body.data || body

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Missing admin payload' }, { status: 400 })
    }

    // Clean payload of metadata that might cause issues with Supabase update
    if (payload.id) delete payload.id
    if (payload.created_at) delete payload.created_at
    if (payload.updated_at) delete payload.updated_at

    if (!id && resource !== 'site_settings') {
      return NextResponse.json({ error: 'Missing id for update' }, { status: 400 })
    }

    const response = !id && resource === 'site_settings'
      ? await supabaseAdmin.from(resource).upsert(payload, { onConflict: 'id' }).select()
      : await supabaseAdmin.from(resource).update(payload).eq('id', id).select()

    if (response.error) throw response.error
    const data = response.data
    const record = Array.isArray(data) ? data[0] : data
    return NextResponse.json({ record })
  } catch (error) {
    console.error('Admin PATCH resource failed', error)
    return NextResponse.json({ error: 'Failed to update admin record' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { resource: string } }
) {
  try {
    const resource = ensureResource(params.resource)
    const body = await parseJson(request)
    const id = body.id

    if (!id) {
      return NextResponse.json({ error: 'Missing id for delete' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.from(resource).delete().eq('id', id).select()
    if (error) throw error
    return NextResponse.json({ record: Array.isArray(data) ? data[0] : data })
  } catch (error) {
    console.error('Admin DELETE resource failed', error)
    return NextResponse.json({ error: 'Failed to delete admin record' }, { status: 500 })
  }
}
