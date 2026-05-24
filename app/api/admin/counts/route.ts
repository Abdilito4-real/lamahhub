import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const res = {}

    const [{ data: menu }, { data: availMenu }, { data: vehicles }, { data: availVehicles }, { data: bookings }, { data: membersActive }, { data: submissionsPaid }] = await Promise.all([
      supabaseAdmin.from('menu_items').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('menu_items').select('*', { count: 'exact', head: true }).eq('available', true),
      supabaseAdmin.from('vehicles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('vehicles').select('*', { count: 'exact', head: true }).eq('available', true),
      supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('members').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabaseAdmin.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'success'),
    ])

    return NextResponse.json({
      menuItemsCount: menu?.count ?? 0,
      availableMenuItemsCount: availMenu?.count ?? 0,
      vehiclesCount: vehicles?.count ?? 0,
      availableVehiclesCount: availVehicles?.count ?? 0,
      bookingsCount: bookings?.count ?? 0,
      activeMembersCount: membersActive?.count ?? 0,
      paidSubmissionsCount: submissionsPaid?.count ?? 0,
    })
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
