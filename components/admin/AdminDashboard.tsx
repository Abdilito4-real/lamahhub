'use client'

import { useEffect, useState } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import {
  UsersIcon,
  BookingIcon,
  CrownIcon,
  CheckIcon,
  ClockIcon,
  SearchIcon,
  FilterIcon,
  ExpandIcon
} from '@/components/lamah/Icons'
import { QRScanner } from './scanner/QRScanner'
import { toast } from 'sonner'

export function AdminDashboard() {
  const {
    bookingsCount,
    activeMembersCount,
    paidSubmissionsCount,
    isLoadingAdminData
  } = useAdmin()

  const [submissions, setSubmissions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showScanner, setShowScanner] = useState(false)
  const [isProcessingScan, setIsProcessingScan] = useState(false)

  const loadSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions')
      const data = await res.json()
      const rows = data.submissions || []
      const normalized = rows.map((r: any) => ({
        ...r,
        qrText: r.qr_text ?? r.qrText,
        qrDataUrl: r.qr_data_url ?? r.qrDataUrl,
        checkedIn: typeof r.checked_in !== 'undefined' ? r.checked_in : r.checkedIn,
        checkInAt: r.check_in_at ?? r.checkInAt,
        createdAt: r.created_at ?? r.createdAt,
        updatedAt: r.updated_at ?? r.updatedAt,
        itemId: r.item_id ?? r.itemId,
      }))
      setSubmissions(normalized)
    } catch {
      setSubmissions([])
    }
  }

  useEffect(() => {
    loadSubmissions()
    const interval = setInterval(loadSubmissions, 10000)
    return () => clearInterval(interval)
  }, [])

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.reference?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === 'all' || s.type === filterType

    return matchesSearch && matchesFilter
  })

  const handleScan = async (reference: string) => {
    if (isProcessingScan) return
    setIsProcessingScan(true)

    try {
      const res = await fetch('/api/submissions/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`Check-in successful for ${data.submission.name}`)
        loadSubmissions()
        setShowScanner(false)
      } else {
        toast.error(data.error || 'Check-in failed')
      }
    } catch (err) {
      toast.error('An error occurred during check-in')
    } finally {
      setIsProcessingScan(false)
    }
  }

  const stats = [
    { label: 'Paid Submissions', value: paidSubmissionsCount, icon: CheckIcon, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Total Bookings', value: bookingsCount, icon: BookingIcon, color: 'text-[#D4A95D]', bg: 'bg-[#D4A95D]/10' },
    { label: 'Active Members', value: activeMembersCount, icon: CrownIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Total Users', value: activeMembersCount, icon: UsersIcon, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ]

  if (isLoadingAdminData && submissions.length === 0) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-[#1E1E1E] rounded-3xl border border-[#2E2E2E]" />
          ))}
        </div>
        <div className="h-96 bg-[#1E1E1E] rounded-3xl border border-[#2E2E2E]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#F5F3EF]">Dashboard</h1>
          <p className="text-[#A0A0A0] mt-1">Real-time overview of your business performance.</p>
        </div>
        <button
          onClick={() => setShowScanner(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#D4A95D] text-[#161616] font-bold hover:bg-[#F5F3EF] transition-all shadow-lg shadow-[#D4A95D]/10"
        >
          <ExpandIcon size={20} />
          Scan QR Check-in
        </button>
      </div>

      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1E1E1E] p-6 rounded-3xl border border-[#2E2E2E] shadow-sm hover:border-[#D4A95D]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-2xl`}>
                <stat.icon className={stat.color} size={20} />
              </div>
            </div>
            <p className="text-[#A0A0A0] text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-[#F5F3EF] mt-1">{stat.value.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      {/* Submissions Section */}
      <div className="bg-[#1E1E1E] rounded-[32px] border border-[#2E2E2E] overflow-hidden">
        <div className="p-6 border-b border-[#2E2E2E] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#F5F3EF]">Recent Submissions</h2>
            <p className="text-sm text-[#A0A0A0]">Auto-refreshes every 10 seconds</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#161616] border border-[#2E2E2E] rounded-xl py-2 pl-10 pr-4 text-sm text-[#F5F3EF] focus:outline-none focus:border-[#D4A95D] w-full sm:w-64"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-[#161616] border border-[#2E2E2E] rounded-xl py-2 px-4 text-sm text-[#F5F3EF] focus:outline-none focus:border-[#D4A95D]"
            >
              <option value="all">All Types</option>
              <option value="membership">Membership</option>
              <option value="booking">Booking</option>
              <option value="event">Event</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161616]/50">
                <th className="px-6 py-4 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Item / Type</th>
                <th className="px-6 py-4 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2E2E]">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#6B6B6B]">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#242424] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#F5F3EF]">{sub.name}</div>
                      <div className="text-xs text-[#A0A0A0]">{sub.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#F5F3EF] font-medium">{sub.title}</div>
                      <div className="text-[10px] uppercase tracking-widest text-[#D4A95D] mt-0.5">{sub.type}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-[#F5F3EF]">
                      ₦{sub.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        sub.status === 'success'
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-yellow-400/10 text-yellow-400'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'success' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-[#A0A0A0]">
                        <ClockIcon size={12} />
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
