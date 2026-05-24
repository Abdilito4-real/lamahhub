'use client'

import { FootballIcon, CarIcon, BoltIcon, UtensilsIcon, SofaIcon, CocktailIcon, PoolCueIcon } from './Icons'
import { ReactNode } from 'react'
import { SectionWrapper } from '@/components/ui/SectionWrapper'

export function AboutSection() {
  const amenities: { icon: ReactNode; name: string; desc: string }[] = [
    { icon: <FootballIcon size={28} />, name: '7-a-side Pitch', desc: 'Professional grade' },
    { icon: <FootballIcon size={28} />, name: '5-a-side Pitch', desc: 'Indoor facility' },
    { icon: <CarIcon size={28} />, name: 'EV Showroom', desc: 'Latest models' },
    { icon: <BoltIcon size={28} />, name: 'Charging Station', desc: 'Fast charging' },
    { icon: <UtensilsIcon size={28} />, name: 'Restaurant', desc: 'Fine dining' },
    { icon: <SofaIcon size={28} />, name: 'Luxury Lounge', desc: 'Premium comfort' },
    { icon: <CocktailIcon size={28} />, name: 'Bar', desc: 'Craft cocktails' },
    { icon: <PoolCueIcon size={28} />, name: 'Snooker', desc: 'Pro tables' },
  ]

  return (
    <SectionWrapper id="about" className="bg-[#1A1A1A] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #D4A95D 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="text-[#D4A95D] text-sm tracking-[0.3em] uppercase mb-4 block">About Us</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F3EF] mb-6 leading-tight">
              Where Luxury Meets
              <span className="text-[#D4A95D]"> Lifestyle</span>
            </h2>
            <p className="text-[#A0A0A0] text-lg leading-relaxed mb-8">
              LAMAH HUB is Kaduna&apos;s newest lifestyle destination powered by KB Lamar Motors. 
              A revolutionary space that combines premium sports facilities, cutting-edge electric 
              mobility, fine dining, and luxurious entertainment under one roof.
            </p>
            <p className="text-[#A0A0A0] text-lg leading-relaxed mb-8">
              Located at Mogadishu City Centre, behind Sidi and Sons, Kaduna, we redefine 
              what it means to experience leisure, sports, and innovation in Northern Nigeria.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="text-center p-4 rounded-xl bg-[#1E1E1E] gold-border-glow">
                <span className="text-3xl md:text-4xl font-bold text-[#D4A95D] block">8+</span>
                <span className="text-[#A0A0A0] text-sm">Experience Zones</span>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#1E1E1E] gold-border-glow">
                <span className="text-3xl md:text-4xl font-bold text-[#D4A95D] block">24/7</span>
                <span className="text-[#A0A0A0] text-sm">Premium Service</span>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#1E1E1E] gold-border-glow">
                <span className="text-3xl md:text-4xl font-bold text-[#D4A95D] block">1st</span>
                <span className="text-[#A0A0A0] text-sm">EV Hub in Kaduna</span>
              </div>
            </div>
          </div>

          {/* Right - Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-48 rounded-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=80" 
                  alt="Football pitch"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/80 to-transparent" />
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80" 
                  alt="EV Charging"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/80 to-transparent" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="relative h-64 rounded-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80" 
                  alt="Restaurant"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/80 to-transparent" />
              </div>
              <div className="relative h-48 rounded-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600&q=80" 
                  alt="Lounge"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/80 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Amenities Grid */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold text-[#F5F3EF] mb-8 text-center">Our Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenities.map((amenity, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#D4A95D]/50 transition-all duration-300 text-center group hover:bg-[#242424]"
              >
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform text-[#D4A95D]">{amenity.icon}</span>
                <h4 className="text-[#F5F3EF] font-semibold mb-1">{amenity.name}</h4>
                <p className="text-[#A0A0A0] text-sm">{amenity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
