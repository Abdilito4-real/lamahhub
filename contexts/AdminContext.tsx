'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabaseBrowser'

// Types
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'starters' | 'mains' | 'desserts' | 'drinks'
  image?: string
  available: boolean
}

export interface EVVehicle {
  id: string
  name: string
  price: number
  range: string
  topSpeed: string
  acceleration: string
  image: string
  features: string[]
  available: boolean
}

export interface Pitch {
  id: string
  name: string
  type: '5-a-side' | '7-a-side'
  pricePerHour: number
  available: boolean
  image: string
}

export interface TimeSlot {
  id: string
  pitchId: string
  date: string
  startTime: string
  endTime: string
  status: 'available' | 'booked' | 'maintenance'
  bookedBy?: string
  price: number
}

export interface Booking {
  id: string
  pitchId: string
  pitchName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
  qrCode?: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  category: 'sports' | 'social' | 'music' | 'corporate'
  price: number
  image: string
  capacity: number
  registered: number
  active: boolean
}

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  tier: 'silver' | 'gold' | 'platinum' | 'corporate'
  joinDate: string
  expiryDate: string
  status: 'active' | 'expired' | 'pending'
  totalSpent: number
}

export interface MembershipTier {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  color: string
  popular?: boolean
}

export interface GalleryImage {
  id: string
  url: string
  category: 'all' | 'sports' | 'ev' | 'dining' | 'events'
  caption: string
  featured: boolean
}

export interface SiteSettings {
  id?: string
  heroTitle: string
  heroSubtitle: string
  aboutTitle: string
  aboutDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: {
    instagram: string
    twitter: string
    facebook: string
    whatsapp: string
  }
}

// Default Data: empty — real data is loaded from Supabase at runtime
const defaultMenuItems: MenuItem[] = []
const defaultVehicles: EVVehicle[] = []
const defaultPitches: Pitch[] = []
const defaultEvents: Event[] = []
const defaultMembershipTiers: MembershipTier[] = []
const defaultGalleryImages: GalleryImage[] = []
const defaultSettings: SiteSettings = {
  heroTitle: '',
  heroSubtitle: '',
  aboutTitle: '',
  aboutDescription: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  socialLinks: { instagram: '', twitter: '', facebook: '', whatsapp: '' },
}

// Context Type
interface AdminContextType {
  // Data
  menuItems: MenuItem[]
  vehicles: EVVehicle[]
  pitches: Pitch[]
  timeSlots: TimeSlot[]
  bookings: Booking[]
  events: Event[]
  members: Member[]
  membershipTiers: MembershipTier[]
  galleryImages: GalleryImage[]
  settings: SiteSettings
  
  // Auth
  isAdmin: boolean
  adminLogin: (email: string, password: string) => Promise<true | string>
  adminLogout: () => Promise<void>
  
  // Menu
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>
  deleteMenuItem: (id: string) => Promise<void>

  // Vehicles
  addVehicle: (vehicle: Omit<EVVehicle, 'id'>) => Promise<void>
  updateVehicle: (id: string, vehicle: Partial<EVVehicle>) => Promise<void>
  deleteVehicle: (id: string) => Promise<void>

  // Pitches
  addPitch: (pitch: Omit<Pitch, 'id'>) => Promise<void>
  updatePitch: (id: string, pitch: Partial<Pitch>) => Promise<void>
  deletePitch: (id: string) => Promise<void>

  // Time Slots
  addTimeSlot: (slot: Omit<TimeSlot, 'id'>) => Promise<void>
  updateTimeSlot: (id: string, slot: Partial<TimeSlot>) => Promise<void>
  deleteTimeSlot: (id: string) => Promise<void>

  // Bookings
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<void>
  updateBooking: (id: string, booking: Partial<Booking>) => Promise<void>
  deleteBooking: (id: string) => Promise<void>

  // Events
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>

  // Members
  addMember: (member: Omit<Member, 'id'>) => Promise<void>
  updateMember: (id: string, member: Partial<Member>) => Promise<void>
  deleteMember: (id: string) => Promise<void>

  // Counts
  menuItemsCount: number
  vehiclesCount: number
  bookingsCount: number
  activeMembersCount: number
  availableVehiclesCount: number
  paidSubmissionsCount: number
  availableMenuItemsCount: number
  isLoadingAdminData: boolean
  adminDataError: string | null
  
  // Membership Tiers
  updateMembershipTier: (id: string, tier: Partial<MembershipTier>) => Promise<void>

  // Gallery
  addGalleryImage: (image: Omit<GalleryImage, 'id'>) => Promise<void>
  updateGalleryImage: (id: string, image: Partial<GalleryImage>) => Promise<void>
  deleteGalleryImage: (id: string) => Promise<void>

  // Settings
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15)

const adminRequest = async <T,>(resource: string, method: 'POST' | 'PATCH' | 'DELETE', body: Record<string, unknown>) => {
  try {
    const res = await fetch(`/api/admin/${resource}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const payload = await res.text()
      throw new Error(payload || `Admin ${method} request failed for ${resource}`)
    }

    const json = await res.json()
    return json as { record?: T; success?: boolean }
  } catch (error) {
    console.error(`Admin ${method} error for ${resource}`, error)
    return null
  }
}

const createResource = async <T,>(resource: string, item: Record<string, unknown>): Promise<T | null> => {
  const result = await adminRequest<T>(resource, 'POST', { item })
  return result?.record ?? null
}

const updateResource = async <T,>(resource: string, id: string, item: Record<string, unknown>): Promise<T | null> => {
  const result = await adminRequest<T>(resource, 'PATCH', { id, item })
  return result?.record ?? null
}

const deleteResource = async (resource: string, id: string): Promise<boolean> => {
  const result = await adminRequest(resource, 'DELETE', { id })
  return result !== null
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems)
  const [vehicles, setVehicles] = useState<EVVehicle[]>(defaultVehicles)
  const [pitches, setPitches] = useState<Pitch[]>(defaultPitches)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [menuItemsCount, setMenuItemsCount] = useState<number>(0)
  const [vehiclesCount, setVehiclesCount] = useState<number>(0)
  const [bookingsCount, setBookingsCount] = useState<number>(0)
  const [activeMembersCount, setActiveMembersCount] = useState<number>(0)
  const [availableVehiclesCount, setAvailableVehiclesCount] = useState<number>(0)
  const [paidSubmissionsCount, setPaidSubmissionsCount] = useState<number>(0)
  const [availableMenuItemsCount, setAvailableMenuItemsCount] = useState<number>(0)
  const [events, setEvents] = useState<Event[]>(defaultEvents)
  const [members, setMembers] = useState<Member[]>([])
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>(defaultMembershipTiers)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(defaultGalleryImages)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [isLoadingAdminData, setIsLoadingAdminData] = useState<boolean>(true)
  const [adminDataError, setAdminDataError] = useState<string | null>(null)

  // Auth
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/session')
        const data = await res.json()
        setIsAdmin(data.isAdmin === true)
      } catch {
        setIsAdmin(false)
      }
    }

    checkSession()
  }, [])

  // Load real data from Supabase (if configured). Falls back to defaults on error.
  useEffect(() => {
    const loadFromSupabase = async () => {
      setIsLoadingAdminData(true)
      setAdminDataError(null)

      try {
        // Parallelize both API calls
        const [countsResponse, dataResponse] = await Promise.allSettled([
          fetch('/api/admin/counts', { cache: 'no-store' }),
          fetch('/api/admin/data', { cache: 'no-store' }),
        ])

        // Process counts
        if (countsResponse.status === 'fulfilled' && countsResponse.value?.ok) {
          try {
            const counts = await countsResponse.value.json()
            setMenuItemsCount(counts.menuItemsCount || 0)
            setAvailableMenuItemsCount(counts.availableMenuItemsCount || 0)
            setVehiclesCount(counts.vehiclesCount || 0)
            setAvailableVehiclesCount(counts.availableVehiclesCount || 0)
            setBookingsCount(counts.bookingsCount || 0)
            setActiveMembersCount(counts.activeMembersCount || 0)
            setPaidSubmissionsCount(counts.paidSubmissionsCount || 0)
          } catch {
            // ignore count parsing failures
          }
        }

        let loadedData = false
        let lastError: string | null = null

        // Process data
        if (dataResponse.status === 'fulfilled' && dataResponse.value?.ok) {
          try {
            const data = await dataResponse.value.json()
            setMenuItems(data.menuItems || [])
            setVehicles(data.vehicles || [])
            setPitches(data.pitches || [])
            setBookings(data.bookings || [])
            setEvents(data.events || [])
            setMembers(data.members || [])
            setMembershipTiers(data.membershipTiers || [])
            setGalleryImages(data.galleryImages || [])
            setSettings(data.settings || defaultSettings)
            loadedData = true
          } catch (e) {
            lastError = (e as Error)?.message || 'Failed to parse admin data'
          }
        } else if (dataResponse.status === 'fulfilled') {
          try {
            const body = await dataResponse.value?.json().catch(() => null)
            lastError = body?.error || `Server responded with ${dataResponse.value?.status}`
          } catch {
            lastError = 'Failed to load admin data'
          }
        } else {
          lastError = (dataResponse.reason as Error)?.message || 'Failed to fetch admin data'
        }

        if (!loadedData) {
          if (!supabase) {
            setAdminDataError(lastError || 'Unable to load admin data. Please try again.')
          } else {
            try {
              const { data: menu, error: menuErr } = await supabase.from('menu_items').select('*')
              if (!menuErr && menu) { setMenuItems(menu as any); loadedData = true }

              const { data: vehiclesData, error: vehiclesErr } = await supabase.from('vehicles').select('*')
              if (!vehiclesErr && vehiclesData) { setVehicles(vehiclesData as any); loadedData = true }

              const { data: pitchesData, error: pitchesErr } = await supabase.from('pitches').select('*')
              if (!pitchesErr && pitchesData) { setPitches(pitchesData as any); loadedData = true }

              const { data: bookingsData, error: bookingsErr } = await supabase.from('bookings').select('*')
              if (!bookingsErr && bookingsData) { setBookings(bookingsData as any); loadedData = true }

              const { data: eventsData, error: eventsErr } = await supabase.from('events').select('*')
              if (!eventsErr && eventsData) { setEvents(eventsData as any); loadedData = true }

              const { data: membersData, error: membersErr } = await supabase.from('members').select('*')
              if (!membersErr && membersData) { setMembers(membersData as any); loadedData = true }

              const { data: tiers, error: tiersErr } = await supabase.from('membership_tiers').select('*')
              if (!tiersErr && tiers) { setMembershipTiers(tiers as any); loadedData = true }

              const { data: gallery, error: galleryErr } = await supabase.from('gallery_images').select('*')
              if (!galleryErr && gallery) { setGalleryImages(gallery as any); loadedData = true }

              const { data: settingsData, error: settingsErr } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
              if (!settingsErr && settingsData) { setSettings(settingsData as any); loadedData = true }
            } catch (err) {
              lastError = (err as Error)?.message || 'Fallback Supabase fetch failed'
            }

            if (!loadedData) {
              setAdminDataError(lastError || 'Unable to load admin data. Please try again.')
            }
          }
        }
      } finally {
        setIsLoadingAdminData(false)
      }
    }

    loadFromSupabase()

    // Subscribe to realtime changes and refresh counts when relevant tables change
    const setupRealtime = async () => {
      try {
        if (!supabase) return

        const watch = async (table: string) => {
          await supabase
            .channel(`table-counts-${table}`)
            .on('postgres_changes', { event: '*', schema: 'public', table }, (payload: any) => {
              try {
                const evt = payload?.eventType || payload?.type || payload?.event || payload?.t || ''
                const rec = payload?.new || payload?.record || payload?.new_record || payload?.new || null
                const oldRec = payload?.old || payload?.old_record || null

                // Normalize event string
                const ev = (String(evt || '')).toUpperCase()

                if (table === 'menu_items') {
                  // total count
                  if (ev === 'INSERT') {
                    setMenuItemsCount((p) => p + 1)
                    if (rec && (rec.available === true || rec.available === 'true')) setAvailableMenuItemsCount((p) => p + 1)
                  } else if (ev === 'DELETE') {
                    setMenuItemsCount((p) => Math.max(0, p - 1))
                    if (oldRec && (oldRec.available === true || oldRec.available === 'true')) setAvailableMenuItemsCount((p) => Math.max(0, p - 1))
                  } else if (ev === 'UPDATE') {
                    if (oldRec && rec) {
                      const oldAvail = oldRec.available === true || oldRec.available === 'true'
                      const newAvail = rec.available === true || rec.available === 'true'
                      if (!oldAvail && newAvail) setAvailableMenuItemsCount((p) => p + 1)
                      if (oldAvail && !newAvail) setAvailableMenuItemsCount((p) => Math.max(0, p - 1))
                    }
                  }
                }

                if (table === 'vehicles') {
                  if (ev === 'INSERT') {
                    setVehiclesCount((p) => p + 1)
                    if (rec && (rec.available === true || rec.available === 'true')) setAvailableVehiclesCount((p) => p + 1)
                  } else if (ev === 'DELETE') {
                    setVehiclesCount((p) => Math.max(0, p - 1))
                    if (oldRec && (oldRec.available === true || oldRec.available === 'true')) setAvailableVehiclesCount((p) => Math.max(0, p - 1))
                  } else if (ev === 'UPDATE') {
                    if (oldRec && rec) {
                      const oldAvail = oldRec.available === true || oldRec.available === 'true'
                      const newAvail = rec.available === true || rec.available === 'true'
                      if (!oldAvail && newAvail) setAvailableVehiclesCount((p) => p + 1)
                      if (oldAvail && !newAvail) setAvailableVehiclesCount((p) => Math.max(0, p - 1))
                    }
                  }
                }

                if (table === 'bookings') {
                  if (ev === 'INSERT') setBookingsCount((p) => p + 1)
                  else if (ev === 'DELETE') setBookingsCount((p) => Math.max(0, p - 1))
                }

                if (table === 'members') {
                  if (ev === 'INSERT') {
                    if (rec && (rec.status === 'active')) setActiveMembersCount((p) => p + 1)
                  } else if (ev === 'DELETE') {
                    if (oldRec && (oldRec.status === 'active')) setActiveMembersCount((p) => Math.max(0, p - 1))
                  } else if (ev === 'UPDATE') {
                    if (oldRec && rec) {
                      const wasActive = oldRec.status === 'active'
                      const nowActive = rec.status === 'active'
                      if (!wasActive && nowActive) setActiveMembersCount((p) => p + 1)
                      if (wasActive && !nowActive) setActiveMembersCount((p) => Math.max(0, p - 1))
                    }
                  }
                }

                if (table === 'submissions') {
                  if (ev === 'INSERT') {
                    if (rec && rec.status === 'success') setPaidSubmissionsCount((p) => p + 1)
                  } else if (ev === 'DELETE') {
                    if (oldRec && oldRec.status === 'success') setPaidSubmissionsCount((p) => Math.max(0, p - 1))
                  } else if (ev === 'UPDATE') {
                    if (oldRec && rec) {
                      const wasPaid = oldRec.status === 'success'
                      const nowPaid = rec.status === 'success'
                      if (!wasPaid && nowPaid) setPaidSubmissionsCount((p) => p + 1)
                      if (wasPaid && !nowPaid) setPaidSubmissionsCount((p) => Math.max(0, p - 1))
                    }
                  }
                }
              } catch (e) {
                // ignore
              }
            })
            .subscribe()
        }

        // tables to watch
        const tables = ['menu_items', 'vehicles', 'bookings', 'members', 'submissions']
        for (const t of tables) await watch(t)
      } catch (e) {
        // ignore realtime setup errors
      }
    }

    setupRealtime()

    return () => {
      try {
        if (supabase && supabase.getChannels) {
          const channels = supabase.getChannels()
          channels.forEach((ch: any) => {
            try { supabase.removeChannel(ch) } catch {}
          })
        }
      } catch {}
    }
  }, [])

  const adminLogin = useCallback(async (email: string, password: string) => {
    try {
      if (!supabase) {
        setIsAdmin(false)
        return 'Supabase client not configured'
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error || !data?.session) {
        setIsAdmin(false)
        console.error('Supabase signInWithPassword failed', { error, data })
        return error?.message || 'Invalid login credentials'
      }

      const accessToken = data.session.access_token
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setIsAdmin(false)
        console.error('Admin login route failed', { status: res.status, body })
        return body?.error || 'Unauthorized'
      }

      setIsAdmin(true)
      return true
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('adminLogin error', err)
      setIsAdmin(false)
      return 'Login failed'
    }
  }, [])

  const adminLogout = useCallback(async () => {
    try {
      if (supabase) {
        try { await supabase.auth.signOut() } catch {}
      }
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch {
      // ignore
    }

    setIsAdmin(false)
  }, [])

  // Menu CRUD
  const addMenuItem = useCallback(async (item: Omit<MenuItem, 'id'>) => {
    const record = await createResource<MenuItem>('menu_items', item)
    if (record) setMenuItems(prev => [...prev, record])
  }, [])

  const updateMenuItem = useCallback(async (id: string, item: Partial<MenuItem>) => {
    const record = await updateResource<MenuItem>('menu_items', id, item)
    if (record) setMenuItems(prev => prev.map(i => i.id === id ? record : i))
  }, [])

  const deleteMenuItem = useCallback(async (id: string) => {
    const deleted = await deleteResource('menu_items', id)
    if (deleted) setMenuItems(prev => prev.filter(i => i.id !== id))
  }, [])

  // Vehicles CRUD
  const addVehicle = useCallback(async (vehicle: Omit<EVVehicle, 'id'>) => {
    const record = await createResource<EVVehicle>('vehicles', vehicle)
    if (record) setVehicles(prev => [...prev, record])
  }, [])

  const updateVehicle = useCallback(async (id: string, vehicle: Partial<EVVehicle>) => {
    const record = await updateResource<EVVehicle>('vehicles', id, vehicle)
    if (record) setVehicles(prev => prev.map(v => v.id === id ? record : v))
  }, [])

  const deleteVehicle = useCallback(async (id: string) => {
    const deleted = await deleteResource('vehicles', id)
    if (deleted) setVehicles(prev => prev.filter(v => v.id !== id))
  }, [])

  // Pitches CRUD
  const addPitch = useCallback(async (pitch: Omit<Pitch, 'id'>) => {
    const record = await createResource<Pitch>('pitches', pitch)
    if (record) setPitches(prev => [...prev, record])
  }, [])

  const updatePitch = useCallback(async (id: string, pitch: Partial<Pitch>) => {
    const record = await updateResource<Pitch>('pitches', id, pitch)
    if (record) setPitches(prev => prev.map(p => p.id === id ? record : p))
  }, [])

  const deletePitch = useCallback(async (id: string) => {
    const deleted = await deleteResource('pitches', id)
    if (deleted) setPitches(prev => prev.filter(p => p.id !== id))
  }, [])

  // Time Slots CRUD
  const addTimeSlot = useCallback(async (slot: Omit<TimeSlot, 'id'>) => {
    const record = await createResource<TimeSlot>('time_slots', slot)
    if (record) setTimeSlots(prev => [...prev, record])
  }, [])

  const updateTimeSlot = useCallback(async (id: string, slot: Partial<TimeSlot>) => {
    const record = await updateResource<TimeSlot>('time_slots', id, slot)
    if (record) setTimeSlots(prev => prev.map(s => s.id === id ? record : s))
  }, [])

  const deleteTimeSlot = useCallback(async (id: string) => {
    const deleted = await deleteResource('time_slots', id)
    if (deleted) setTimeSlots(prev => prev.filter(s => s.id !== id))
  }, [])

  // Bookings CRUD
  const addBooking = useCallback(async (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const record = await createResource<Booking>('bookings', booking)
    if (record) setBookings(prev => [...prev, record])
  }, [])

  const updateBooking = useCallback(async (id: string, booking: Partial<Booking>) => {
    const record = await updateResource<Booking>('bookings', id, booking)
    if (record) setBookings(prev => prev.map(b => b.id === id ? record : b))
  }, [])

  const deleteBooking = useCallback(async (id: string) => {
    const deleted = await deleteResource('bookings', id)
    if (deleted) setBookings(prev => prev.filter(b => b.id !== id))
  }, [])

  // Events CRUD
  const addEvent = useCallback(async (event: Omit<Event, 'id'>) => {
    const record = await createResource<Event>('events', event)
    if (record) setEvents(prev => [...prev, record])
  }, [])

  const updateEvent = useCallback(async (id: string, event: Partial<Event>) => {
    const record = await updateResource<Event>('events', id, event)
    if (record) setEvents(prev => prev.map(e => e.id === id ? record : e))
  }, [])

  const deleteEvent = useCallback(async (id: string) => {
    const deleted = await deleteResource('events', id)
    if (deleted) setEvents(prev => prev.filter(e => e.id !== id))
  }, [])

  // Members CRUD
  const addMember = useCallback(async (member: Omit<Member, 'id'>) => {
    const record = await createResource<Member>('members', member)
    if (record) setMembers(prev => [...prev, record])
  }, [])

  const updateMember = useCallback(async (id: string, member: Partial<Member>) => {
    const record = await updateResource<Member>('members', id, member)
    if (record) setMembers(prev => prev.map(m => m.id === id ? record : m))
  }, [])

  const deleteMember = useCallback(async (id: string) => {
    const deleted = await deleteResource('members', id)
    if (deleted) setMembers(prev => prev.filter(m => m.id !== id))
  }, [])

  // Membership Tiers
  const updateMembershipTier = useCallback(async (id: string, tier: Partial<MembershipTier>) => {
    const record = await updateResource<MembershipTier>('membership_tiers', id, tier)
    if (record) setMembershipTiers(prev => prev.map(t => t.id === id ? record : t))
  }, [])

  // Gallery CRUD
  const addGalleryImage = useCallback(async (image: Omit<GalleryImage, 'id'>) => {
    const record = await createResource<GalleryImage>('gallery_images', image)
    if (record) setGalleryImages(prev => [...prev, record])
  }, [])

  const updateGalleryImage = useCallback(async (id: string, image: Partial<GalleryImage>) => {
    const record = await updateResource<GalleryImage>('gallery_images', id, image)
    if (record) setGalleryImages(prev => prev.map(i => i.id === id ? record : i))
  }, [])

  const deleteGalleryImage = useCallback(async (id: string) => {
    const deleted = await deleteResource('gallery_images', id)
    if (deleted) setGalleryImages(prev => prev.filter(i => i.id !== id))
  }, [])

  // Settings
  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    const updated = await createResource<SiteSettings>('site_settings', { ...settings, ...newSettings })
    if (updated) setSettings(updated)
  }, [settings])

  return (
    <AdminContext.Provider value={{
      menuItems,
      menuItemsCount,
      availableMenuItemsCount,
      vehicles,
      vehiclesCount,
      availableVehiclesCount,
      pitches,
      timeSlots,
      bookings,
      bookingsCount,
      activeMembersCount,
      events,
      members,
      paidSubmissionsCount,
      membershipTiers,
      galleryImages,
      settings,
      isAdmin,
      adminLogin,
      adminLogout,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addPitch,
      updatePitch,
      deletePitch,
      addTimeSlot,
      updateTimeSlot,
      deleteTimeSlot,
      addBooking,
      updateBooking,
      deleteBooking,
      addEvent,
      updateEvent,
      deleteEvent,
      addMember,
      updateMember,
      deleteMember,
      updateMembershipTier,
      addGalleryImage,
      updateGalleryImage,
      deleteGalleryImage,
      updateSettings,
      isLoadingAdminData,
      adminDataError,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
