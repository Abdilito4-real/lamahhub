'use client'

import { useState } from 'react'
import { useAdmin, Booking } from '@/contexts/AdminContext'
import { SearchIcon, FilterIcon, CheckIcon, XIcon, ClockIcon, CalendarIcon, BookingIcon } from '@/components/lamah/Icons'

export function AdminBookings() {
  const { bookings, updateBooking, deleteBooking, pitches } = useAdmin()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      booking.customerEmail?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statuses = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-400/10 text-yellow-400'
      case 'confirmed': return 'bg-green-400/10 text-green-400'
      case 'completed': return 'bg-blue-400/10 text-blue-400'
      case 'cancelled': return 'bg-red-400/10 text-red-400'
      default: return 'bg-[#2E2E2E] text-[#A0A0A0]'
    }
  }

  const handleStatusChange = (id: string, status: Booking['status']) => {
    updateBooking(id, { status })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#F5F3EF]">Bookings</h1>
        <p className="text-[#A0A0A0] mt-1">{bookings.length} total bookings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.slice(1).map((status) => (
          <div key={status} className="bg-[#1E1E1E] rounded-xl p-4 border border-[#2E2E2E]">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(status)}`}>
              {status}
            </span>
            <p className="text-2xl font-bold text-[#F5F3EF] mt-2">
              {bookings.filter(b => b.status === status).length}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl py-2.5 pl-11 pr-4 text-[#F5F3EF] placeholder-[#6B6B6B] focus:border-[#D4A95D] focus:outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors
                ${statusFilter === status 
                  ? 'bg-[#D4A95D] text-[#161616]' 
                  : 'bg-[#1E1E1E] text-[#A0A0A0] hover:bg-[#242424]'}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E]">
            <BookingIcon size={48} className="mx-auto text-[#2E2E2E] mb-4" />
            <p className="text-[#6B6B6B]">No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-[#1E1E1E] rounded-xl border border-[#2E2E2E] p-4 hover:border-[#D4A95D]/30 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[#F5F3EF] font-semibold">{booking.customerName}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#A0A0A0]">{booking.customerEmail}</p>
                  <p className="text-sm text-[#6B6B6B]">{booking.customerPhone}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                  <div className="flex items-center gap-2 text-[#A0A0A0]">
                    <CalendarIcon size={16} className="text-[#D4A95D]" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#A0A0A0]">
                    <ClockIcon size={16} className="text-[#D4A95D]" />
                    <span>{booking.startTime} - {booking.endTime}</span>
                  </div>
                  <div className="text-[#D4A95D] font-semibold">
                    N{booking.totalPrice?.toLocaleString() ?? '0'}
                  </div>
                </div>
                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors text-sm"
                      >
                        <CheckIcon size={14} />
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors text-sm"
                      >
                        <XIcon size={14} />
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(booking.id, 'completed')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 transition-colors text-sm"
                    >
                      <CheckIcon size={14} />
                      Complete
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#2E2E2E] text-xs text-[#6B6B6B]">
                <span className="text-[#A0A0A0]">{booking.pitchName}</span>
                <span className="mx-2">|</span>
                <span>Booked {new Date(booking.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
