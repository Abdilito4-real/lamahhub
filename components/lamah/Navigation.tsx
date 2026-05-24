'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SettingsIcon } from './Icons'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Experience', href: '#experience' },
    { name: 'Pitches', href: '#pitches' },
    { name: 'EV Showroom', href: '#ev-showroom' },
    { name: 'Dining', href: '#dining' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-dark py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
            <Image src="/logo.png" alt="Lamah Hub logo" width={40} height={40} className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#F5F3EF] font-semibold tracking-wider text-lg">LAMAH HUB</span>
            <span className="text-[#D4A95D] text-[10px] tracking-[0.2em] uppercase">Lifestyle Destination</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[#A0A0A0] hover:text-[#D4A95D] transition-colors duration-300 text-sm tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 rounded-lg text-[#6B6B6B] hover:text-[#D4A95D] hover:bg-[#1E1E1E] transition-all duration-300"
            title="Admin Dashboard"
          >
            <SettingsIcon size={20} />
          </Link>
          <a
            href="#booking"
            className="px-6 py-3 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold text-sm hover:bg-[#F5F3EF] transition-all duration-300 hover:shadow-lg hover:shadow-[#D4A95D]/20"
          >
            Book Now
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={`w-6 h-0.5 bg-[#F5F3EF] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-[#F5F3EF] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-[#F5F3EF] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden glass-dark transition-all duration-500 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen py-6' : 'max-h-0'}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[#A0A0A0] hover:text-[#D4A95D] transition-colors duration-300 text-lg py-2 border-b border-[#2E2E2E]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#booking"
            className="mt-4 px-6 py-4 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book Now
          </a>
        </div>
      </div>
    </nav>
  )
}
