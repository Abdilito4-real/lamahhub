'use client'

import { useState, useEffect } from 'react'

interface Pitch {
  id: string
  name: string
  type: '7-a-side' | '5-a-side'
  status: 'available' | 'occupied' | 'reserved'
  currentMatch?: {
    teams: [string, string]
    score: [number, number]
    timeRemaining: number
  }
  nextBooking?: {
    time: string
    team: string
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function LivePitchAvailability() {
  const [pitches, setPitches] = useState<Pitch[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const loadPitches = async () => {
      try {
        const response = await fetch('/api/pitches/availability', { cache: 'no-store' })
        if (!response.ok) return

        const data = await response.json()
        if (!Array.isArray(data.pitches)) return

        setPitches(
          data.pitches.map((pitch: any) => ({
            id: pitch.id,
            name: pitch.name || 'Unknown Pitch',
            type: pitch.type === '5-a-side' ? '5-a-side' : '7-a-side',
            status: pitch.available === true ? 'available' : 'reserved',
          }))
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch pitch availability', error)
      }
    }

    loadPitches()
  }, [])

  // Simulate countdown timer for occupied pitches
  useEffect(() => {
    const interval = setInterval(() => {
      setPitches((prev) =>
        prev.map((pitch) => {
          if (pitch.status === 'occupied' && pitch.currentMatch) {
            const newTime = pitch.currentMatch.timeRemaining - 1
            if (newTime <= 0) {
              return {
                ...pitch,
                status: 'available',
                currentMatch: undefined,
              }
            }
            return {
              ...pitch,
              currentMatch: {
                ...pitch.currentMatch,
                timeRemaining: newTime,
              },
            }
          }
          return pitch
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: Pitch['status']) => {
    switch (status) {
      case 'available':
        return 'status-available'
      case 'occupied':
        return 'status-occupied'
      case 'reserved':
        return 'status-reserved'
    }
  }

  const getStatusText = (status: Pitch['status']) => {
    switch (status) {
      case 'available':
        return 'Available Now'
      case 'occupied':
        return 'Match in Progress'
      case 'reserved':
        return 'Reserved'
    }
  }

  return (
    <section id="pitches" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-6">
          <div>
            <span className="text-[#D4A95D] text-sm tracking-[0.3em] uppercase mb-4 block">Real-time</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#F5F3EF] mb-4">
              Live Pitch <span className="text-[#D4A95D]">Availability</span>
            </h2>
            <p className="text-[#A0A0A0] text-lg max-w-xl">
              Check real-time availability and book your preferred pitch instantly.
            </p>
          </div>

          {/* Status Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full status-available" />
              <span className="text-[#A0A0A0] text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full status-reserved" />
              <span className="text-[#A0A0A0] text-sm">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full status-occupied" />
              <span className="text-[#A0A0A0] text-sm">Occupied</span>
            </div>
          </div>
        </div>

        {/* Pitch Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {pitches.map((pitch) => (
            <div 
              key={pitch.id}
              className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#D4A95D]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[#F5F3EF]">{pitch.name}</h3>
                    <span className="px-3 py-1 text-xs rounded-full bg-[#D4A95D]/10 text-[#D4A95D]">
                      {pitch.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(pitch.status)}`} />
                    <span className="text-[#A0A0A0] text-sm">{getStatusText(pitch.status)}</span>
                  </div>
                </div>
                
                {/* Live Indicator for occupied */}
                {pitch.status === 'occupied' && (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#DC2626]/10">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                    <span className="text-[#DC2626] text-xs font-medium">LIVE</span>
                  </div>
                )}
              </div>

              {/* Current Match Info */}
              {pitch.status === 'occupied' && pitch.currentMatch && (
                <div className="p-4 rounded-xl bg-[#161616] mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#A0A0A0] text-xs uppercase tracking-wider">Current Match</span>
                    <span className="text-[#D4A95D] font-mono text-lg font-bold">
                      {formatTime(pitch.currentMatch.timeRemaining)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-[#F5F3EF] font-medium">{pitch.currentMatch.teams[0]}</span>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2E2E2E]">
                      <span className="text-2xl font-bold text-[#F5F3EF]">{pitch.currentMatch.score[0]}</span>
                      <span className="text-[#A0A0A0]">-</span>
                      <span className="text-2xl font-bold text-[#F5F3EF]">{pitch.currentMatch.score[1]}</span>
                    </div>
                    <span className="text-[#F5F3EF] font-medium">{pitch.currentMatch.teams[1]}</span>
                  </div>
                </div>
              )}

              {/* Next Booking Info */}
              {pitch.nextBooking && pitch.status !== 'occupied' && (
                <div className="p-4 rounded-xl bg-[#161616] mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#A0A0A0] text-xs uppercase tracking-wider block mb-1">Next Booking</span>
                      <span className="text-[#F5F3EF] font-medium">{pitch.nextBooking.team}</span>
                    </div>
                    <span className="text-[#D4A95D] font-semibold">{pitch.nextBooking.time}</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <a
                href="#booking"
                className={`w-full py-3 rounded-xl font-semibold text-center block transition-all duration-300 ${
                  pitch.status === 'available'
                    ? 'bg-[#D4A95D] text-[#161616] hover:bg-[#F5F3EF]'
                    : 'bg-[#2E2E2E] text-[#A0A0A0] cursor-not-allowed'
                }`}
              >
                {pitch.status === 'available' ? 'Book Now' : 'View Schedule'}
              </a>
            </div>
          ))}
        </div>

        {/* Quick Book CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#D4A95D]/10 to-[#6B4F3A]/10 border border-[#D4A95D]/20 text-center">
          <h3 className="text-2xl font-bold text-[#F5F3EF] mb-3">Ready to Play?</h3>
          <p className="text-[#A0A0A0] mb-6">Book your pitch in seconds. Instant confirmation with QR code access.</p>
          <a
            href="#booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold hover:bg-[#F5F3EF] transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book a Pitch
          </a>
        </div>
      </div>
    </section>
  )
}
