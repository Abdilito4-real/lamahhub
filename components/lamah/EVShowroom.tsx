'use client'

import { useState } from 'react'

const vehicles = [
  {
    id: 'model-s',
    name: 'Tesla Model S',
    category: 'Luxury Sedan',
    price: '₦45,000,000',
    range: '652 km',
    acceleration: '2.1s',
    topSpeed: '322 km/h',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
    features: ['Autopilot', 'Premium Audio', 'Panoramic Roof', 'Full Self-Driving Capability'],
  },
  {
    id: 'model-x',
    name: 'Tesla Model X',
    category: 'Luxury SUV',
    price: '₦55,000,000',
    range: '560 km',
    acceleration: '2.6s',
    topSpeed: '262 km/h',
    image: 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=800&q=80',
    features: ['Falcon Wing Doors', '7 Seats', 'HEPA Filter', 'Premium Interior'],
  },
  {
    id: 'model-3',
    name: 'Tesla Model 3',
    category: 'Sports Sedan',
    price: '₦28,000,000',
    range: '576 km',
    acceleration: '3.3s',
    topSpeed: '261 km/h',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
    features: ['Glass Roof', '15" Display', 'Premium Connectivity', 'All-Wheel Drive'],
  },
  {
    id: 'byd-atto',
    name: 'BYD Atto 3',
    category: 'Compact SUV',
    price: '₦22,000,000',
    range: '420 km',
    acceleration: '7.3s',
    topSpeed: '160 km/h',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80',
    features: ['Blade Battery', 'Rotating Display', 'Vehicle-to-Load', 'Premium Sound'],
  },
]

export function EVShowroom() {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0])
  const [showTestDriveForm, setShowTestDriveForm] = useState(false)

  return (
    <section id="ev-showroom" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-[#1A1A1A] to-[#161616]" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4A95D] text-sm tracking-[0.3em] uppercase mb-4 block">Electric Mobility</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F3EF] mb-6">
            EV <span className="text-[#D4A95D]">Showroom</span>
          </h2>
          <p className="text-[#A0A0A0] text-lg max-w-2xl mx-auto">
            Experience the future of transportation. Explore our premium collection of electric vehicles 
            and schedule a test drive today.
          </p>
        </div>

        {/* Featured Vehicle Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Vehicle Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/80 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full glass">
                <span className="text-[#D4A95D] text-sm font-semibold">{selectedVehicle.category}</span>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-[#D4A95D]/20 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-[#D4A95D]/10 rounded-2xl -z-10" />
          </div>

          {/* Vehicle Details */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-[#F5F3EF] mb-2">{selectedVehicle.name}</h3>
            <p className="text-[#D4A95D] text-xl font-semibold mb-6">{selectedVehicle.price}</p>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-[#1E1E1E] text-center">
                <span className="text-[#A0A0A0] text-xs uppercase tracking-wider block mb-1">Range</span>
                <span className="text-[#F5F3EF] font-bold text-lg">{selectedVehicle.range}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#1E1E1E] text-center">
                <span className="text-[#A0A0A0] text-xs uppercase tracking-wider block mb-1">0-100 km/h</span>
                <span className="text-[#F5F3EF] font-bold text-lg">{selectedVehicle.acceleration}</span>
              </div>
              <div className="p-4 rounded-xl bg-[#1E1E1E] text-center">
                <span className="text-[#A0A0A0] text-xs uppercase tracking-wider block mb-1">Top Speed</span>
                <span className="text-[#F5F3EF] font-bold text-lg">{selectedVehicle.topSpeed}</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h4 className="text-[#A0A0A0] text-sm uppercase tracking-wider mb-3">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {selectedVehicle.features.map((feature, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-2 text-sm rounded-lg bg-[#D4A95D]/10 text-[#D4A95D] border border-[#D4A95D]/20"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowTestDriveForm(true)}
                className="flex-1 py-4 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold hover:bg-[#F5F3EF] transition-colors"
              >
                Schedule Test Drive
              </button>
              <button className="px-6 py-4 border border-[#2E2E2E] text-[#F5F3EF] rounded-xl hover:bg-[#2E2E2E] transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {vehicles.map((vehicle) => (
            <button
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedVehicle.id === vehicle.id
                  ? 'bg-[#D4A95D]/10 border-2 border-[#D4A95D]'
                  : 'bg-[#1E1E1E] border-2 border-transparent hover:border-[#D4A95D]/30'
              }`}
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-semibold text-[#F5F3EF] text-sm mb-1">{vehicle.name}</h4>
              <p className="text-[#D4A95D] text-xs">{vehicle.price}</p>
            </button>
          ))}
        </div>

        {/* Charging Info */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#1E1E1E] to-[#242424] border border-[#2E2E2E]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#D4A95D]/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#D4A95D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#F5F3EF]">On-Site Charging</h4>
                <p className="text-[#A0A0A0]">Fast charging available while you explore</p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <span className="text-2xl font-bold text-[#D4A95D]">4</span>
                <p className="text-[#A0A0A0] text-sm">Charging Points</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-[#D4A95D]">150kW</span>
                <p className="text-[#A0A0A0] text-sm">Max Power</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-[#D4A95D]">24/7</span>
                <p className="text-[#A0A0A0] text-sm">Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Drive Modal */}
      {showTestDriveForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161616]/90 backdrop-blur-sm">
          <div className="bg-[#1E1E1E] rounded-2xl p-8 max-w-md w-full border border-[#2E2E2E]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#F5F3EF]">Schedule Test Drive</h3>
              <button 
                onClick={() => setShowTestDriveForm(false)}
                className="text-[#A0A0A0] hover:text-[#F5F3EF]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">Selected Vehicle</label>
                <div className="p-3 rounded-lg bg-[#161616] text-[#D4A95D] font-semibold">
                  {selectedVehicle.name}
                </div>
              </div>
              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full p-3 rounded-lg bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full p-3 rounded-lg bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#A0A0A0] text-sm mb-2">Preferred Date</label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg bg-[#161616] border border-[#2E2E2E] text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowTestDriveForm(false)}
                className="w-full py-4 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold hover:bg-[#F5F3EF] transition-colors mt-6"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
