'use client'

import { useEffect, useState } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

interface ExperienceZone {
  id: string | number
  title: string
  subtitle?: string
  description?: string
  features?: string[]
  image: string
  icon?: string
}

const defaultZones: ExperienceZone[] = []

const getZoneIcon = (icon?: string) => {
  switch (icon) {
    case 'football':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" strokeWidth="1.5" />
        </svg>
      )
    case 'ev':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'charging':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
        </svg>
      )
    case 'restaurant':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case 'lounge':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    case 'bar':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    case 'snooker':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
          <circle cx="6" cy="8" r="2" strokeWidth="1.5" />
          <circle cx="18" cy="16" r="2" strokeWidth="1.5" />
        </svg>
      )
    case 'vip':
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    default:
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
        </svg>
      )
  }
}

export function ExperienceZones() {
  const [zones, setZones] = useState<ExperienceZone[]>(defaultZones)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch('/api/public/experiences', { cache: 'no-store' })
        if (!response.ok) {
          setZones(defaultZones)
          return
        }

        const body = await response.json()
        setZones(Array.isArray(body.experiences) ? body.experiences : defaultZones)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load experience zones:', error)
        setZones(defaultZones)
      } finally {
        setIsLoading(false)
      }
    }

    fetchZones()
  }, [])

  return (
    <SectionWrapper id="experience" className="bg-[#1A1A1A] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-transparent to-[#161616]" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#D4A95D] text-sm tracking-[0.3em] uppercase mb-4 block">Discover</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F3EF] mb-6">
            Experience <span className="text-[#D4A95D]">Zones</span>
          </h2>
          <p className="text-[#A0A0A0] text-lg max-w-2xl mx-auto">
            Explore premium experiences in sports, leisure, dining, and electric mobility powered by LAMAH HUB.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-[320px] rounded-2xl bg-[#171717] border border-[#2E2E2E] animate-pulse" />
            ))}
          </div>
        ) : zones.length === 0 ? (
          <div className="rounded-3xl border border-[#2E2E2E] bg-[#161616] p-12 text-center text-[#A0A0A0]">
            No experience zones are available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="group relative min-h-[360px] lg:h-[400px] rounded-2xl overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredZone(String(zone.id))}
                onMouseLeave={() => setHoveredZone(null)}
              >
                <img
                  src={zone.image}
                  alt={zone.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/60 to-transparent" />
                <div className={`absolute inset-0 border-2 rounded-2xl transition-all duration-500 ${
                  hoveredZone === String(zone.id) ? 'border-[#D4A95D]/50' : 'border-transparent'
                }`} />

                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className={`mb-4 text-[#D4A95D] transition-transform duration-500 ${
                    hoveredZone === String(zone.id) ? 'scale-110' : ''
                  }`}>
                    {getZoneIcon(zone.icon)}
                  </div>
                  <span className="text-[#D4A95D] text-xs tracking-[0.2em] uppercase mb-1">{zone.subtitle}</span>
                  <h3 className="text-xl font-bold text-[#F5F3EF] mb-2">{zone.title}</h3>

                  <div className={`overflow-hidden transition-all duration-500 ${
                    hoveredZone === String(zone.id) ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <p className="text-[#A0A0A0] text-sm mb-4">{zone.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(zone.features) ? zone.features : []).slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-[#D4A95D]/10 text-[#D4A95D] rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

