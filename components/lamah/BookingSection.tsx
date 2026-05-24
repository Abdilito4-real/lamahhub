'use client'

import { useState } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

interface TimeSlot {
  time: string
  available: boolean
  price: number
}

interface BookingForm {
  pitchType: '7-a-side' | '5-a-side'
  date: string
  timeSlot: string
  teamName: string
  phone: string
  email: string
}

const timeSlots: TimeSlot[] = [
  { time: '08:00 AM', available: true, price: 15000 },
  { time: '09:00 AM', available: true, price: 15000 },
  { time: '10:00 AM', available: false, price: 15000 },
  { time: '11:00 AM', available: true, price: 15000 },
  { time: '12:00 PM', available: true, price: 18000 },
  { time: '01:00 PM', available: false, price: 18000 },
  { time: '02:00 PM', available: true, price: 18000 },
  { time: '03:00 PM', available: true, price: 18000 },
  { time: '04:00 PM', available: false, price: 20000 },
  { time: '05:00 PM', available: true, price: 20000 },
  { time: '06:00 PM', available: true, price: 25000 },
  { time: '07:00 PM', available: true, price: 25000 },
  { time: '08:00 PM', available: false, price: 25000 },
  { time: '09:00 PM', available: true, price: 25000 },
]

export function BookingSection() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<BookingForm>({
    pitchType: '7-a-side',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    teamName: '',
    phone: '',
    email: '',
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingError('')

    if (!form.timeSlot || !form.teamName || !form.phone || !form.email) {
      setBookingError('Please complete all booking fields before continuing.')
      return
    }

    const selectedSlot = timeSlots.find(slot => slot.time === form.timeSlot)
    if (!selectedSlot) {
      setBookingError('Please select a valid time slot.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        email: form.email,
        amount: selectedSlot.price,
        name: form.teamName,
        phone: form.phone,
        type: 'booking',
        itemId: `${form.pitchType}-${form.date}-${form.timeSlot}`,
        title: `Pitch Booking (${form.pitchType}) - ${form.date} ${form.timeSlot}`,
        tickets: 1,
        teamName: form.teamName,
        notes: `Pitch booking for ${form.pitchType} on ${form.date} at ${form.timeSlot}`,
      }

      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok || !data.authorization_url) {
        setBookingError(data.error || 'Unable to initialize Paystack payment.')
        return
      }

      window.location.href = data.authorization_url
    } catch (error) {
      setBookingError('Unable to start payment. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedSlot = timeSlots.find(slot => slot.time === form.timeSlot)

  return (
    <SectionWrapper id="booking" className="bg-[#1A1A1A] relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, #D4A95D 25%, transparent 25%), linear-gradient(-45deg, #D4A95D 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #D4A95D 75%), linear-gradient(-45deg, transparent 75%, #D4A95D 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#D4A95D] text-sm tracking-[0.3em] uppercase mb-4 block">Reserve Your Spot</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F3EF] mb-4">
            Book a <span className="text-[#D4A95D]">Pitch</span>
          </h2>
          <p className="text-[#A0A0A0] text-lg max-w-xl mx-auto">
            Select your preferred pitch, date, and time. Receive instant QR confirmation.
          </p>
        </div>

        {!showConfirmation ? (
          <div className="bg-[#1E1E1E] rounded-2xl p-8 border border-[#2E2E2E]">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-10">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s ? 'bg-[#D4A95D] text-[#161616]' : 'bg-[#2E2E2E] text-[#A0A0A0]'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`w-20 h-1 mx-2 rounded transition-colors ${
                      step > s ? 'bg-[#D4A95D]' : 'bg-[#2E2E2E]'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Select Pitch */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#F5F3EF] mb-6">Select Pitch Type</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, pitchType: '7-a-side' })}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        form.pitchType === '7-a-side' 
                          ? 'border-[#D4A95D] bg-[#D4A95D]/10' 
                          : 'border-[#2E2E2E] hover:border-[#D4A95D]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-[#F5F3EF]">7-a-side Pitch</span>
                        {form.pitchType === '7-a-side' && (
                          <span className="w-6 h-6 rounded-full bg-[#D4A95D] flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#161616]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <p className="text-[#A0A0A0] text-sm mb-3">Full-size football experience with professional turf</p>
                      <span className="text-[#D4A95D] font-semibold">From ₦15,000/hr</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setForm({ ...form, pitchType: '5-a-side' })}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        form.pitchType === '5-a-side' 
                          ? 'border-[#D4A95D] bg-[#D4A95D]/10' 
                          : 'border-[#2E2E2E] hover:border-[#D4A95D]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-[#F5F3EF]">5-a-side Pitch</span>
                        {form.pitchType === '5-a-side' && (
                          <span className="w-6 h-6 rounded-full bg-[#D4A95D] flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#161616]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <p className="text-[#A0A0A0] text-sm mb-3">Compact indoor arena perfect for quick games</p>
                      <span className="text-[#D4A95D] font-semibold">From ₦12,000/hr</span>
                    </button>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full py-4 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold hover:bg-[#F5F3EF] transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Select Date & Time */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#F5F3EF] mb-6">Select Date & Time</h3>
                  
                  {/* Date Picker */}
                  <div>
                    <label className="block text-[#A0A0A0] text-sm mb-2">Select Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-4 rounded-xl bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-[#A0A0A0] text-sm mb-3">Available Time Slots</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setForm({ ...form, timeSlot: slot.time })}
                          className={`p-3 rounded-lg text-center text-sm transition-all ${
                            !slot.available 
                              ? 'bg-[#2E2E2E]/50 text-[#555] cursor-not-allowed line-through' 
                              : form.timeSlot === slot.time
                                ? 'bg-[#D4A95D] text-[#161616]'
                                : 'bg-[#161616] text-[#A0A0A0] hover:bg-[#2E2E2E]'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Display */}
                  {selectedSlot && (
                    <div className="p-4 rounded-xl bg-[#161616] flex items-center justify-between">
                      <span className="text-[#A0A0A0]">Estimated Price</span>
                      <span className="text-2xl font-bold text-[#D4A95D]">₦{selectedSlot.price?.toLocaleString() ?? '0'}</span>
                    </div>
                  )}

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 border border-[#2E2E2E] text-[#F5F3EF] rounded-xl font-semibold hover:bg-[#2E2E2E] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!form.timeSlot}
                      className="flex-1 py-4 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold hover:bg-[#F5F3EF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-[#F5F3EF] mb-6">Your Details</h3>
                  
                  <div>
                    <label className="block text-[#A0A0A0] text-sm mb-2">Team Name</label>
                    <input
                      type="text"
                      value={form.teamName}
                      onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                      placeholder="Enter your team name"
                      className="w-full p-4 rounded-xl bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#A0A0A0] text-sm mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+234 XXX XXX XXXX"
                        className="w-full p-4 rounded-xl bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#A0A0A0] text-sm mb-2">Email Address</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full p-4 rounded-xl bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="p-6 rounded-xl bg-[#161616] space-y-3">
                    <h4 className="font-semibold text-[#F5F3EF] mb-4">Booking Summary</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A0A0A0]">Pitch Type</span>
                      <span className="text-[#F5F3EF]">{form.pitchType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A0A0A0]">Date</span>
                      <span className="text-[#F5F3EF]">{new Date(form.date).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A0A0A0]">Time</span>
                      <span className="text-[#F5F3EF]">{form.timeSlot}</span>
                    </div>
                    <div className="border-t border-[#2E2E2E] pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-[#F5F3EF]">Total</span>
                        <span className="text-2xl font-bold text-[#D4A95D]">₦{selectedSlot?.price.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 border border-[#2E2E2E] text-[#F5F3EF] rounded-xl font-semibold hover:bg-[#2E2E2E] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold hover:bg-[#F5F3EF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Processing payment...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              )}
            </form>
            {bookingError && (
              <p className="mt-4 text-sm text-red-400">{bookingError}</p>
            )}
          </div>
        ) : (
          /* Confirmation with QR Code */
          <div className="bg-[#1E1E1E] rounded-2xl p-8 border border-[#D4A95D]/30 text-center">
            <div className="w-20 h-20 rounded-full bg-[#22C55E]/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#F5F3EF] mb-2">Booking Confirmed!</h3>
            <p className="text-[#A0A0A0] mb-8">Your reservation has been secured. Show this QR code at check-in.</p>

            {/* Mock QR Code */}
            <div className="inline-block p-4 bg-[#F5F3EF] rounded-xl mb-8">
              <div className="w-48 h-48 bg-[#161616]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23F5F3EF' width='200' height='200'/%3E%3Cg fill='%23161616'%3E%3Crect x='10' y='10' width='60' height='60'/%3E%3Crect x='130' y='10' width='60' height='60'/%3E%3Crect x='10' y='130' width='60' height='60'/%3E%3Crect x='20' y='20' width='40' height='40' fill='%23F5F3EF'/%3E%3Crect x='140' y='20' width='40' height='40' fill='%23F5F3EF'/%3E%3Crect x='20' y='140' width='40' height='40' fill='%23F5F3EF'/%3E%3Crect x='30' y='30' width='20' height='20'/%3E%3Crect x='150' y='30' width='20' height='20'/%3E%3Crect x='30' y='150' width='20' height='20'/%3E%3Crect x='80' y='10' width='10' height='10'/%3E%3Crect x='100' y='10' width='10' height='10'/%3E%3Crect x='80' y='30' width='10' height='10'/%3E%3Crect x='110' y='30' width='10' height='10'/%3E%3Crect x='90' y='50' width='10' height='10'/%3E%3Crect x='80' y='70' width='10' height='10'/%3E%3Crect x='100' y='70' width='10' height='10'/%3E%3Crect x='110' y='70' width='10' height='10'/%3E%3Crect x='80' y='90' width='10' height='10'/%3E%3Crect x='90' y='90' width='10' height='10'/%3E%3Crect x='110' y='90' width='10' height='10'/%3E%3Crect x='80' y='110' width='10' height='10'/%3E%3Crect x='100' y='110' width='10' height='10'/%3E%3Crect x='130' y='80' width='10' height='10'/%3E%3Crect x='150' y='80' width='10' height='10'/%3E%3Crect x='170' y='80' width='10' height='10'/%3E%3Crect x='140' y='100' width='10' height='10'/%3E%3Crect x='160' y='100' width='10' height='10'/%3E%3Crect x='130' y='120' width='10' height='10'/%3E%3Crect x='150' y='120' width='10' height='10'/%3E%3Crect x='170' y='120' width='10' height='10'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: 'cover',
              }} />
            </div>

            <div className="text-left p-4 rounded-xl bg-[#161616] mb-6">
              <p className="text-sm text-[#A0A0A0]">Booking Reference</p>
              <p className="text-xl font-mono font-bold text-[#D4A95D]">LH-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            </div>

            <button
              onClick={() => { setShowConfirmation(false); setStep(1); setForm({ ...form, timeSlot: '', teamName: '', phone: '', email: '' }); }}
              className="px-8 py-4 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold hover:bg-[#F5F3EF] transition-colors"
            >
              Make Another Booking
            </button>
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
