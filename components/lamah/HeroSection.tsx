'use client'

import { useEffect, useRef, useState } from 'react'

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const slides = [
    
    {
      title: "Welcome to",
      highlight: "Lamah Hub",
      subtitle: "A lifestyle destination like no other.",
      image: "/images/lamah.png",
    },
    {
      title: "Premium",
      highlight: "Football Pitches",
      subtitle: "7-a-side & 5-a-side. Book your match today.",
      image: "/images/hero.jpg",
    },
    {
      title: "Electric",
      highlight: "Vehicle Showroom",
      subtitle: "The future of mobility is here.",
      image: "/images/hero-2.jpg",
    },
    {
      title: "The New",
      highlight: "Pulse of Kaduna",
      subtitle: "Sports. Leisure. Innovation. Mobility.",
      image: "/images/hero-3.jpg",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <section id="hero" className="relative min-h-[80vh] md:min-h-[700px] overflow-hidden">
      {/* Background Video/Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url('${slides[currentSlide].image}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#161616]/70 via-[#161616]/50 to-[#161616]" />
        
        {/* Animated Gold Edge Lines */}
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#D4A95D]/30 to-transparent" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#D4A95D]/30 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4A95D]/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated Text Content */}
          <div className="overflow-hidden mb-4">
            <p 
              key={`subtitle-${currentSlide}`}
              className="text-[#D4A95D] text-sm md:text-base tracking-[0.3em] uppercase mb-6 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              Welcome to LAMAH HUB
            </p>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#F5F3EF] mb-2 leading-tight">
            <span 
              key={`title-${currentSlide}`}
              className="block animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              {slides[currentSlide].title}
            </span>
            <span 
              key={`highlight-${currentSlide}`}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4A95D] to-[#6B4F3A] animate-fade-in-up"
              style={{ animationDelay: '0.6s' }}
            >
              {slides[currentSlide].highlight}
            </span>
          </h1>
          
          <p 
            key={`desc-${currentSlide}`}
            className="text-xl md:text-2xl text-[#A0A0A0] mt-6 mb-10 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
          >
            {slides[currentSlide].subtitle}
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: '1s' }}
          >
            <a
              href="#experience"
              className="group px-8 py-4 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold text-lg hover:bg-[#F5F3EF] transition-all duration-300 flex items-center gap-2"
            >
              Explore The Hub
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#booking"
              className="px-8 py-4 border border-[#D4A95D]/50 text-[#F5F3EF] rounded-xl font-semibold text-lg hover:bg-[#D4A95D]/10 hover:border-[#D4A95D] transition-all duration-300"
            >
              Book Experience
            </a>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-12 h-1 rounded-full transition-all duration-500 ${
                index === currentSlide ? 'bg-[#D4A95D]' : 'bg-[#3C3C3C]'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[#A0A0A0] text-xs tracking-wider uppercase">Scroll</span>
          <svg className="w-5 h-5 text-[#D4A95D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
