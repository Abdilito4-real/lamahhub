const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const envPath = path.join(__dirname, '../.env.local')
const envRaw = fs.readFileSync(envPath, 'utf8')
const env = envRaw
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .reduce((acc, line) => {
    const [key, ...rest] = line.split('=')
    acc[key.trim()] = rest.join('=').trim()
    return acc
  }, {})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const { randomUUID } = require('crypto')

const menuItems = [
  { id: randomUUID(), name: 'Suya Skewers', description: 'Grilled spiced beef with yaji seasoning', price: 4500, category: 'starters', available: true },
  { id: randomUUID(), name: 'Spring Rolls', description: 'Crispy rolls with vegetable filling', price: 3200, category: 'starters', available: true },
  { id: randomUUID(), name: 'Prime Ribeye Steak', description: '300g steak with mashed potatoes', price: 28000, category: 'mains', available: true },
  { id: randomUUID(), name: 'Jollof Rice & Grilled Chicken', description: 'Premium party-style jollof with herb-crusted chicken', price: 12000, category: 'mains', available: true },
  { id: randomUUID(), name: 'Chocolate Lava Cake', description: 'Warm cake with molten center', price: 4500, category: 'desserts', available: true },
  { id: randomUUID(), name: 'Ice Cream Selection', description: 'Three scoops of premium gelato', price: 3000, category: 'desserts', available: true },
]

const vehicles = [
  { id: randomUUID(), name: 'Tesla Model S', price: 45000000, range: '652 km', acceleration: '2.1s', top_speed: '322 km/h', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80', features: ['Autopilot', 'Premium Audio', 'Panoramic Roof', 'Full Self-Driving Capability'], available: true },
  { id: randomUUID(), name: 'Tesla Model X', price: 55000000, range: '560 km', acceleration: '2.6s', top_speed: '262 km/h', image: 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800&q=80', features: ['Falcon Wing Doors', '7 Seats', 'HEPA Filter', 'Premium Interior'], available: true },
  { id: randomUUID(), name: 'Tesla Model 3', price: 28000000, range: '576 km', acceleration: '3.3s', top_speed: '261 km/h', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80', features: ['Glass Roof', '15" Display', 'Premium Connectivity', 'All-Wheel Drive'], available: true },
  { id: randomUUID(), name: 'BYD Atto 3', price: 22000000, range: '420 km', acceleration: '7.3s', top_speed: '160 km/h', image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80', features: ['Blade Battery', 'Rotating Display', 'Vehicle-to-Load', 'Premium Sound'], available: true },
]

const members = [
  { id: randomUUID(), name: 'Amina Yusuf', email: 'amina@yamahub.com', phone: '08012345678', tier: 'gold', join_date: '2026-05-01', expiry_date: '2027-05-01', status: 'active', total_spent: 65000 },
  { id: randomUUID(), name: 'Michael Okoro', email: 'michael@yamahub.com', phone: '08087654321', tier: 'silver', join_date: '2026-06-01', expiry_date: '2027-06-01', status: 'active', total_spent: 35000 },
]

const pitches = [
  { id: randomUUID(), name: '7-a-side Pitch A', type: '7-a-side', price_per_hour: 25000, available: true, image: 'https://images.unsplash.com/photo-1558980664-10d5f2fe8cb2?w=800&q=80' },
]

const experiences = [
  {
    id: randomUUID(),
    title: 'Football Pitches',
    subtitle: 'Premium Sports',
    description: 'State-of-the-art 5-a-side and 7-a-side pitches with professional turf, floodlighting, and real-time booking support.',
    features: ['7-a-side Pitch', '5-a-side Pitch', 'Floodlighting', 'Scoreboard'],
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    icon: 'football',
  },
  {
    id: randomUUID(),
    title: 'EV Showroom',
    subtitle: 'Electric Mobility',
    description: 'Discover premium electric vehicles and get expert guidance with test drives and financing options.',
    features: ['Electric Vehicles', 'Test Drives', 'Product Launches', 'Consultations'],
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80',
    icon: 'ev',
  },
  {
    id: randomUUID(),
    title: 'Charging Station',
    subtitle: 'Fast Power',
    description: 'High-speed EV chargers supporting multiple connector types, available while you relax in the lounge.',
    features: ['Fast Charging', 'Multiple Connectors', 'Live Status', '24/7 Access'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    icon: 'charging',
  },
  {
    id: randomUUID(),
    title: 'Restaurant',
    subtitle: 'Fine Dining',
    description: 'A gourmet restaurant offering local and international dishes, curated by our award-winning chefs.',
    features: ['Gourmet Menu', 'Private Dining', 'Chef Specials', 'Reservations'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    icon: 'restaurant',
  },
  {
    id: randomUUID(),
    title: 'Luxury Lounge',
    subtitle: 'Premium Comfort',
    description: 'Relax in an upscale lounge with ambient music, premium service, and private seating areas.',
    features: ['VIP Seating', 'Ambient Music', 'Premium Service', 'Private Areas'],
    image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80',
    icon: 'lounge',
  },
  {
    id: randomUUID(),
    title: 'Bar',
    subtitle: 'Craft Cocktails',
    description: 'Enjoy handcrafted cocktails, premium spirits, and a curated drink menu in our stylish bar.',
    features: ['Craft Cocktails', 'Premium Spirits', 'Wine Selection', 'Expert Mixologists'],
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
    icon: 'bar',
  },
  {
    id: randomUUID(),
    title: 'Snooker',
    subtitle: 'Pro Tables',
    description: 'Professional snooker tables in a refined setting, perfect for casual play and competitive matches.',
    features: ['Pro Tables', 'Quality Equipment', 'Tournament Ready', 'Coaching Available'],
    image: '/images/snooker.webp',
    icon: 'snooker',
  },
  {
    id: randomUUID(),
    title: 'VIP Rooms',
    subtitle: 'Exclusive Access',
    description: 'Private luxury rooms designed for special events, corporate meetings, and premium guest experiences.',
    features: ['Private Rooms', 'Dedicated Service', 'Custom Menus', 'Event Hosting'],
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/4e/e9/2a/vip-room-2.jpg?w=900&h=500&s=1',
    icon: 'vip',
  },
]

const bookings = [
  { id: randomUUID(), pitch_id: pitches[0].id, pitch_name: pitches[0].name, customer_name: 'Psyberly Labs', customer_email: 'psyberlylabs@gmail.com', customer_phone: '34576789678', date: '2026-05-19', start_time: '06:00 PM', end_time: '07:00 PM', total_price: 25000, status: 'confirmed', created_at: new Date().toISOString(), qr_code: 'LAMAHHUB:ey3ij5xzdf' },
]

const submissionFile = path.join(__dirname, '../data/submissions.json')
const submissionsPayload = JSON.parse(fs.readFileSync(submissionFile, 'utf8'))
const submissions = submissionsPayload.submissions.map((item) => ({
  id: item.id || randomUUID(),
  reference: item.reference,
  type: item.type,
  item_id: randomUUID(),
  title: item.title,
  name: item.name,
  email: item.email,
  phone: item.phone,
  amount: item.amount,
  status: item.status,
  qr_text: item.qrText || item.qr_text,
  checked_in: item.checkedIn || item.checked_in || false,
  created_at: item.createdAt || item.created_at,
  updated_at: item.updatedAt || item.updated_at,
  payload: item.payload || item.payload,
}))

async function seedTable(table, rows, onConflict) {
  if (!rows.length) return
  const { data, error } = await supabase.from(table).upsert(rows, { onConflict: onConflict || 'id' })
  if (error) {
    console.error(`Failed to seed ${table}:`, error.message)
  } else {
    console.log(`Seeded ${rows.length} rows into ${table}`)
  }
}

;(async () => {
  await seedTable('menu_items', menuItems, 'id')
  await seedTable('vehicles', vehicles, 'id')
  await seedTable('members', members, 'id')
  await seedTable('pitches', pitches, 'id')
  await seedTable('experiences', experiences, 'id')
  await seedTable('bookings', bookings, 'id')
  await seedTable('submissions', submissions, 'id')

  console.log('Seed complete. Verify the dashboard now.')
  process.exit(0)
})()
