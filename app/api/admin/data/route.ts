import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const [menuRes, vehiclesRes, pitchesRes, bookingsRes, eventsRes, membersRes, tiersRes, galleryRes, timeSlotsRes, settingsRes] = await Promise.all([
      supabaseAdmin.from('menu_items').select('*').order('name', { ascending: true }),
      supabaseAdmin.from('vehicles').select('*').order('name', { ascending: true }),
      supabaseAdmin.from('pitches').select('*').order('name', { ascending: true }),
      supabaseAdmin.from('bookings').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('events').select('*').order('date', { ascending: false }),
      supabaseAdmin.from('members').select('*').order('join_date', { ascending: false }),
      supabaseAdmin.from('membership_tiers').select('*').order('price', { ascending: true }),
      supabaseAdmin.from('gallery_images').select('*').order('id', { ascending: true }),
      supabaseAdmin.from('time_slots').select('*').order('date', { ascending: true }),
      supabaseAdmin.from('site_settings').select('*').limit(1).maybeSingle(),
    ])

    return NextResponse.json({
      menuItems: menuRes.data || [],
      vehicles: vehiclesRes.data || [],
      pitches: pitchesRes.data || [],
      bookings: bookingsRes.data || [],
      events: eventsRes.data || [],
      members: membersRes.data || [],
      membershipTiers: tiersRes.data || [],
      galleryImages: galleryRes.data || [],
      timeSlots: timeSlotsRes.data || [],
      settings: settingsRes.data || null,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Admin data fetch failed', error)
    return NextResponse.json({ error: 'failed to load admin data' }, { status: 500 })
  }
}
