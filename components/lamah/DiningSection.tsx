'use client'

import { useEffect, useMemo, useState } from 'react'

interface MenuItem {
  id: string | number
  name: string
  description?: string
  price?: string | number
  category?: string
  available?: boolean
}

const defaultMenuItems: MenuItem[] = []

export function DiningSection() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems)
  const [showReservation, setShowReservation] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/public/menu', { cache: 'no-store' })
        if (!response.ok) return

        const body = await response.json()
        setMenuItems(body.menu || defaultMenuItems)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load menu items:', error)
        setMenuItems(defaultMenuItems)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const availableMenuItems = useMemo(
    () => menuItems.filter((item) => item.available !== false),
    [menuItems]
  )

  const categories = useMemo(() => {
    const groups = Array.from(new Set(availableMenuItems.map((item) => item.category || 'Menu')))
    return groups.length ? ['All', ...groups] : ['All']
  }, [availableMenuItems])

  const menuCategories = useMemo(() =>
    categories
      .filter((name) => name !== 'All')
      .map((name) => ({
        name,
        items: availableMenuItems.filter((item) => (item.category || 'Menu') === name),
      })),
    [categories, availableMenuItems]
  )

  return (
    <section id="dining" className="py-24 md:py-32 bg-[#1A1A1A] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A95D]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6B4F3A]/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4A95D] text-sm tracking-[0.3em] uppercase mb-4 block">Fine Dining</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F3EF] mb-6">
            Restaurant & <span className="text-[#D4A95D]">Lounge</span>
          </h2>
          <p className="text-[#A0A0A0] text-lg max-w-2xl mx-auto">
            Indulge in a culinary journey featuring the finest local and international cuisines, 
            expertly crafted cocktails, and an ambiance designed for sophistication.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Menu Section */}
          <div>
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <h3 className="text-2xl font-bold text-[#F5F3EF]">Menu Highlights</h3>
              {/* Category Tabs */}
              <div className="hidden md:flex flex-wrap gap-2">
                {categories.map((name) => (
                  <button
                    key={name}
                    onClick={() => setActiveCategory(name)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === name
                        ? 'bg-[#D4A95D] text-[#161616]'
                        : 'text-[#A0A0A0] hover:text-[#F5F3EF]'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Category Select */}
            <div className="md:hidden mb-6">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#1E1E1E] border border-[#2E2E2E] text-[#F5F3EF]"
              >
                {categories.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#2E2E2E] text-center text-[#A0A0A0]">Loading menu...</div>
              ) : menuItems.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#2E2E2E] text-center text-[#A0A0A0]">No menu items available.</div>
              ) : (
                (activeCategory === 'All' ? availableMenuItems : availableMenuItems.filter((item) => (item.category || 'Menu') === activeCategory))
                  .map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="p-5 rounded-xl bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#D4A95D]/30 transition-colors group"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h4 className="text-[#F5F3EF] font-semibold mb-1 group-hover:text-[#D4A95D] transition-colors truncate">
                            {item.name}
                          </h4>
                          <p className="text-[#A0A0A0] text-sm line-clamp-3">{item.description}</p>
                        </div>
                        <span className="text-[#D4A95D] font-bold whitespace-nowrap">{typeof item.price === 'number' ? `₦${item.price.toLocaleString()}` : item.price}</span>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <button className="mt-6 text-[#D4A95D] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              View Full Menu
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Atmosphere & Reservation */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80"
                  alt="Restaurant interior"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/80 to-transparent" />
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden group">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdJ0aeVdmHUgFugg-zybHPTc1YR4iXI9gMiA&s"
                  alt="Slush area"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/80 to-transparent" />
              </div>
            </div>

            {/* Featured Categories */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E1E1E] to-[#242424] border border-[#2E2E2E]">
              <h4 className="text-lg font-bold text-[#F5F3EF] mb-4">Featured Dining Categories</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {categories.filter((name) => name !== 'All').slice(0, 4).map((category) => (
                  <div key={category} className="rounded-2xl border border-[#2E2E2E] p-4 bg-[#161616]">
                    <span className="text-[#D4A95D] text-sm uppercase tracking-[0.2em] block mb-2">{category}</span>
                    <p className="text-[#A0A0A0] text-sm">
                      {availableMenuItems.filter((item) => (item.category || 'Menu') === category).length} items available
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reservation CTA */}
            <button
              onClick={() => setShowReservation(true)}
              className="w-full py-5 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold text-lg hover:bg-[#F5F3EF] transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Reserve a Table
            </button>
          </div>
        </div>

        {/* Bar Section */}
        <div className="mt-20 p-8 rounded-2xl bg-[#1E1E1E] border border-[#2E2E2E]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="text-[#D4A95D] text-sm tracking-[0.2em] uppercase block mb-2">Premium Bar</span>
              <h3 className="text-2xl font-bold text-[#F5F3EF] mb-4">Craft Cocktails & Fine Spirits</h3>
              <p className="text-[#A0A0A0] mb-6">
                Our expert mixologists craft signature cocktails using premium spirits and fresh ingredients. 
                Enjoy our extensive wine collection or choose from our selection of rare whiskeys.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Signature Cocktails', 'Premium Whiskey', 'Wine Selection', 'Craft Beer'].map((item) => (
                  <span key={item} className="px-4 py-2 rounded-lg bg-[#D4A95D]/10 text-[#D4A95D] text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-full md:w-64 aspect-square rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80"
                alt="Cocktails"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161616]/90 backdrop-blur-sm">
          <div className="bg-[#1E1E1E] rounded-2xl p-8 max-w-md w-full border border-[#2E2E2E]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#F5F3EF]">Make a Reservation</h3>
              <button 
                onClick={() => setShowReservation(false)}
                className="text-[#A0A0A0] hover:text-[#F5F3EF]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A0A0A0] text-sm mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-lg bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#A0A0A0] text-sm mb-2">Time</label>
                  <select className="w-full p-3 rounded-lg bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none">
                    <option>6:00 PM</option>
                    <option>7:00 PM</option>
                    <option>8:00 PM</option>
                    <option>9:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">Number of Guests</label>
                <select className="w-full p-3 rounded-lg bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none">
                  <option>2 guests</option>
                  <option>4 guests</option>
                  <option>6 guests</option>
                  <option>8+ guests</option>
                </select>
              </div>
              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full p-3 rounded-lg bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">Phone</label>
                <input
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full p-3 rounded-lg bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowReservation(false)}
                className="w-full py-4 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold hover:bg-[#F5F3EF] transition-colors mt-6"
              >
                Confirm Reservation
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
