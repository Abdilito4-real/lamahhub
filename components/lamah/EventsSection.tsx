'use client'

import { useState, useEffect, type FormEvent } from 'react'

interface EventType {
  id: string | number
  title: string
  category?: string
  date: string
  time?: string
  description?: string
  image?: string
  price?: string
  spotsLeft?: number
}

const defaultEvents: EventType[] = []

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex gap-3">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hrs' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sec' },
      ].map((item, idx) => (
        <div key={idx} className="text-center">
          <div className="w-12 h-12 rounded-lg bg-[#161616] flex items-center justify-center mb-1">
            <span className="text-lg font-bold text-[#D4A95D]">{item.value}</span>
          </div>
          <span className="text-[10px] text-[#A0A0A0] uppercase">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function EventsSection() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [eventList, setEventList] = useState<EventType[]>(defaultEvents)
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tickets: '1',
    teamName: '',
    notes: '',
  })
  const [paymentError, setPaymentError] = useState('')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/public/events', { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          setEventList(data.events || defaultEvents)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch events:', error)
        setEventList(defaultEvents)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const categories = ['All', ...new Set(eventList.map((e) => e.category).filter(Boolean))]

  const parseAmount = (price?: string | number) => {
    if (typeof price === 'number') return price
    if (!price) return 0
    return Number(price.toString().replace(/[^\d]/g, '')) || 0
  }

  const filteredEvents = selectedCategory === 'All'
    ? eventList
    : eventList.filter(event => event.category === selectedCategory)

  const openRegistration = (event: EventType) => {
    setSelectedEvent(event)
    setPaymentError('')
    setFormData({ name: '', email: '', phone: '', tickets: '1', teamName: '', notes: '' })
  }

  const closeRegistration = () => {
    setSelectedEvent(null)
    setPaymentError('')
    setIsProcessingPayment(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedEvent) return

    setPaymentError('')
    setIsProcessingPayment(true)

    const amount = parseAmount(selectedEvent.price)
    const payload = {
      email: formData.email,
      amount,
      name: formData.name,
      phone: formData.phone,
      type: 'event',
      itemId: selectedEvent.id.toString(),
      title: selectedEvent.title,
      tickets: formData.tickets,
      teamName: formData.teamName,
      notes: formData.notes,
    }

    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        setPaymentError(data.error || 'Unable to start payment. Please try again.')
        setIsProcessingPayment(false)
        return
      }

      if (!data.authorization_url) {
        setPaymentError('Paystack did not return a payment URL.')
        setIsProcessingPayment(false)
        return
      }

      window.location.href = data.authorization_url
    } catch (error) {
      setPaymentError('Payment initialization failed. Please try again.')
      setIsProcessingPayment(false)
    }
  }

  return (
    <section id="events" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#D4A95D] text-sm tracking-[0.3em] uppercase mb-4 block">Upcoming</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F3EF] mb-6">
            Events & <span className="text-[#D4A95D]">Activities</span>
          </h2>
          <p className="text-[#A0A0A0] text-lg max-w-2xl mx-auto">
            From exciting tournaments to exclusive launches and unforgettable nights - 
            there&apos;s always something happening at LAMAH HUB.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-[#D4A95D] text-[#161616]'
                  : 'bg-[#1E1E1E] text-[#A0A0A0] hover:text-[#F5F3EF] border border-[#2E2E2E]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-[#A0A0A0]">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-[#A0A0A0]">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filteredEvents.map((event) => (
              <div 
                key={event.id}
                className="group rounded-2xl overflow-hidden bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#D4A95D]/30 transition-all"
              >
                {/* Event Image */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={event.image || 'https://via.placeholder.com/800x600?text=No+Image'}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/50 to-transparent" />
                  
                  {/* Category Badge */}
                  {event.category && (
                    <div className="absolute top-3 md:top-4 left-3 md:left-4 px-2 md:px-3 py-1 rounded-full bg-[#D4A95D] text-[#161616] text-xs font-semibold">
                      {event.category}
                    </div>
                  )}

                  {/* Spots Left */}
                  {event.spotsLeft !== undefined && (
                    <div className="absolute top-3 md:top-4 right-3 md:right-4 px-2 md:px-3 py-1 rounded-full glass text-[#F5F3EF] text-xs">
                      {event.spotsLeft} spots left
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-[#F5F3EF] mb-2 group-hover:text-[#D4A95D] transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex flex-col gap-2 text-xs md:text-sm text-[#A0A0A0]">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(event.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                        </span>
                        {event.time && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {event.time}
                          </span>
                        )}
                      </div>
                    </div>
                    {event.price && (
                      <span className="text-[#D4A95D] font-bold text-sm md:text-base whitespace-nowrap">{event.price}</span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-[#A0A0A0] text-xs md:text-sm mb-4 md:mb-6 line-clamp-2">{event.description}</p>
                  )}

                  {/* Countdown and Button */}
                  <div className="flex items-center justify-between gap-2 md:gap-4">
                    <Countdown targetDate={event.date} />
                    <button
                      onClick={() => openRegistration(event)}
                      disabled={(event.spotsLeft ?? 0) <= 0}
                      className={`px-3 md:px-5 py-2 rounded-lg font-semibold text-xs md:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                        (event.spotsLeft ?? 0) <= 0
                          ? 'bg-[#3C3C3C] text-[#6B6B6B] cursor-not-allowed'
                          : 'bg-[#D4A95D] text-[#161616] hover:bg-[#F5F3EF]'
                      }`}
                    >
                      {(event.spotsLeft ?? 0) <= 0 ? 'Sold Out' : 'Register'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Events */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-8 py-4 border border-[#D4A95D] text-[#D4A95D] rounded-xl font-semibold hover:bg-[#D4A95D] hover:text-[#161616] transition-all">
            View All Events
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          {selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-[#161616]/90 backdrop-blur-sm overflow-y-auto">
              <div className="bg-[#1E1E1E] rounded-2xl md:rounded-3xl p-5 md:p-8 max-w-2xl w-full border border-[#2E2E2E] shadow-2xl shadow-black/30 my-8">
                <div className="flex items-start justify-between gap-3 md:gap-6 mb-4 md:mb-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-2xl font-bold text-[#F5F3EF] break-words">Register for {selectedEvent.title}</h3>
                    <p className="text-xs md:text-sm text-[#A0A0A0] mt-1">
                      {selectedEvent.category && <span>{selectedEvent.category} · </span>}
                      {new Date(selectedEvent.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {selectedEvent.time && <span> · {selectedEvent.time}</span>}
                    </p>
                  </div>
                  <button
                    onClick={closeRegistration}
                    className="text-[#A0A0A0] hover:text-[#F5F3EF] flex-shrink-0"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form className="space-y-4 md:space-y-5" onSubmit={(e) => handleSubmit(e as FormEvent<HTMLFormElement>)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-[#A0A0A0] text-xs md:text-sm mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        required
                        className="w-full p-2 md:p-3 rounded-lg md:rounded-xl bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A0A0A0] text-xs md:text-sm mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        required
                        className="w-full p-2 md:p-3 rounded-lg md:rounded-xl bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-[#A0A0A0] text-xs md:text-sm mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+234 812 345 6789"
                        required
                        className="w-full p-2 md:p-3 rounded-lg md:rounded-xl bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A0A0A0] text-xs md:text-sm mb-2">Tickets / Team Size</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedEvent.spotsLeft ?? 1}
                        value={formData.tickets}
                        onChange={(e) => setFormData({ ...formData, tickets: e.target.value })}
                        required
                        className="w-full p-2 md:p-3 rounded-lg md:rounded-xl bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#A0A0A0] text-xs md:text-sm mb-2">Team / Group Name</label>
                    <input
                      type="text"
                      value={formData.teamName}
                      onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                      placeholder="Team name or group"
                      className="w-full p-2 md:p-3 rounded-lg md:rounded-xl bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A0A0A0] text-xs md:text-sm mb-2">Additional Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any special requests or questions"
                      rows={3}
                      className="w-full p-2 md:p-3 rounded-lg md:rounded-xl bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none text-sm resize-none"
                    />
                  </div>

                  {paymentError ? (
                    <p className="text-xs md:text-sm text-red-400">{paymentError}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full py-3 md:py-4 bg-[#D4A95D] text-[#161616] rounded-lg md:rounded-xl font-semibold hover:bg-[#F5F3EF] transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                  >
                    {isProcessingPayment ? 'Starting payment...' : 'Confirm Registration'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
