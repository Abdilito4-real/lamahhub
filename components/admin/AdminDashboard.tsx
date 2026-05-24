'use client'

import { useEffect, useRef, useState } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import {
  UsersIcon,
  BookingIcon,
  CarIcon,
  UtensilsIcon,
  TrophyIcon,
  CalendarIcon,
} from '@/components/lamah/Icons'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

export function AdminDashboard() {
  const {
    bookings,
    members,
    vehicles,
    menuItems,
    events,
    pitches,
    menuItemsCount,
    vehiclesCount,
    bookingsCount,
    activeMembersCount,
    availableVehiclesCount,
    paidSubmissionsCount,
    availableMenuItemsCount,
  } = useAdmin()

  const [submissions, setSubmissions] = useState<any[]>([])
  const [qrPreview, setQrPreview] = useState<string | null>(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [checkinLoading, setCheckinLoading] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [scannerActive, setScannerActive] = useState(false)
  const [scannerStatus, setScannerStatus] = useState('Ready to scan QR code')
  const [scannerCode, setScannerCode] = useState('')
  const [scannerResult, setScannerResult] = useState<any | null>(null)
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const { toast } = useToast()

  useEffect(() => {
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
    loadSubmissions()
  }, [])

  const parseReference = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return ''
    if (trimmed.toUpperCase().startsWith('LAMAHHUB:')) {
      return trimmed.split(':').slice(1).join(':').trim()
    }
    return trimmed
  }

  const showQr = async (submission: any) => {
    if (!submission) return
    if (submission.qrDataUrl) {
      setQrPreview(submission.qrDataUrl)
      return
    }
    if (submission.qrText) {
      try {
        setQrLoading(true)
        const qrcode = await import('qrcode')
        const dataUrl = await qrcode.toDataURL(submission.qrText)
        setQrPreview(dataUrl)
      } catch {
        setQrPreview(null)
      } finally {
        setQrLoading(false)
      }
      return
    }
    setQrPreview(null)
  }

  const searchSubmission = (code: string) => {
    const reference = parseReference(code)
    if (!reference) {
      setScannerResult(null)
      setScannerStatus('Enter or scan a valid QR code value.')
      setIsResultDialogOpen(false)
      return
    }
    const found = submissions.find((item) => item.reference === reference)
    if (found) {
      setScannerResult(found)
      setScannerStatus(`Found submission for ${found.name || 'Unknown name'}`)
    } else {
      setScannerResult({ reference, notFound: true })
      setScannerStatus('No submission found for this QR reference.')
    }
    setIsResultDialogOpen(true)
  }

  const stopCamera = async () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    setScannerActive(false)
  }

  useEffect(() => {
    return () => {
      stopCamera().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scanCamera = async () => {
    if (!videoRef.current || !canvasRef.current || !scannerActive) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      if (scannerActive) requestAnimationFrame(scanCamera)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    try {
      
      const hasNative = typeof window !== 'undefined' && 'BarcodeDetector' in window

      if (hasNative) {
        const imageBitmap = await createImageBitmap(canvas)
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })
        const barcodes = await detector.detect(imageBitmap)
        imageBitmap.close()
        if (barcodes && barcodes.length > 0) {
          const value = barcodes[0].rawValue || barcodes[0].displayValue || ''
          if (value) {
            setScannerCode(value)
            searchSubmission(value)
            await stopCamera()
            return
          }
        }
      } else {
        setScannerStatus('Using jsQR fallback for scanning...')
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        try {
          const jsqrModule = await import('jsqr')
          const jsQR = (jsqrModule && (jsqrModule.default || jsqrModule)) as any
          if (typeof jsQR === 'function') {
            const qr = jsQR(imageData.data, imageData.width, imageData.height)
            if (qr && qr.data) {
              setScannerCode(qr.data)
              searchSubmission(qr.data)
              await stopCamera()
              return
            }
          }
        } catch (err) {
          console.warn('jsQR fallback failed', err)
        }
      }
    } catch (error) {
      console.error('QR scan error', error)
    }

    if (scannerActive) requestAnimationFrame(scanCamera)
  }

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setScannerStatus('Camera not available. Use manual entry below.')
      return
    }
    try {
      setScannerStatus('Starting camera...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      setCameraStream(stream)
      setScannerActive(true)
      setScannerStatus('Preparing camera...')
    } catch {
      setScannerStatus('Unable to access camera. Use manual entry.')
    }
  }

  useEffect(() => {
    if (!cameraStream || !videoRef.current) return
    const video = videoRef.current
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    video.srcObject = cameraStream

    const onReady = async () => {
      try {
        await video.play()
      } catch {
        // ignore
      }
      setScannerStatus('Scanning for QR code...')
      requestAnimationFrame(scanCamera)
    }

    video.addEventListener('loadedmetadata', onReady, { once: true })
    video.addEventListener('playing', onReady, { once: true })
    if (video.readyState >= 2) onReady().catch(() => {})

    return () => {
      video.removeEventListener('loadedmetadata', onReady)
      video.removeEventListener('playing', onReady)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraStream])

  const inspectScannerCode = () => searchSubmission(scannerCode)

  const markCheckedIn = async (reference: string) => {
    setCheckinLoading(reference)
    try {
      const res = await fetch('/api/submissions/checkin', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      })

      const text = await res.text()
      let data: any = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = { error: text }
      }

      if (!res.ok) {
        const message = data?.error || data?.message || text || res.statusText || 'Unable to complete check-in.'
        toast({ title: 'Check-in failed', description: message, variant: 'destructive' })
        return
      }

      const sub = data.submission
      const normalized = sub
        ? {
            ...sub,
            qrText: sub.qr_text ?? sub.qrText,
            qrDataUrl: sub.qr_data_url ?? sub.qrDataUrl,
            checkedIn: typeof sub.checked_in !== 'undefined' ? sub.checked_in : sub.checkedIn,
            checkInAt: sub.check_in_at ?? sub.checkInAt,
            createdAt: sub.created_at ?? sub.createdAt,
            updatedAt: sub.updated_at ?? sub.updatedAt,
            itemId: sub.item_id ?? sub.itemId,
          }
        : null

      if (normalized) {
        setSubmissions((prev) => prev.map((item) => (item.reference === reference ? normalized : item)))
      }
    } finally {
      setCheckinLoading(null)
    }
  }

  const markScannerCheckedIn = async () => {
    if (!scannerResult?.reference || scannerResult.notFound || scannerResult.checkedIn) return
    setScannerStatus('Marking attendee as checked in...')

    try {
      await markCheckedIn(scannerResult.reference)
      const updated = submissions.find((item) => item.reference === scannerResult.reference)
      const resultData = updated || scannerResult
      setScannerResult(resultData)
      setScannerStatus('✓ Checked in successfully!')
      toast({
        title: 'Checked in successfully',
        description: `${resultData.name || resultData.title || resultData.reference} is now checked in.`,
      })
      setTimeout(() => {
        setIsResultDialogOpen(false)
        setScannerCode('')
        setScannerStatus('Ready to scan QR code')
        setScannerResult(null)
      }, 1500)
    } catch (error) {
      console.error(error)
      setScannerStatus('Failed to mark checked in. Try again.')
      toast({ title: 'Check-in failed', description: 'Unable to complete check-in. Please retry.', variant: 'destructive' })
    }
  }

  const closeQr = () => setQrPreview(null)

  const stats = [
    { label: 'Total Bookings', value: bookingsCount, icon: BookingIcon, sub: '+12%', color: '#D4A95D' },
    { label: 'Active Members', value: activeMembersCount, icon: UsersIcon, sub: '+8%', color: '#22C55E' },
    {
      label: 'Available Vehicles',
      value: availableVehiclesCount,
      icon: CarIcon,
      sub: `${vehiclesCount} total`,
      color: '#3B82F6',
    },
    {
      label: 'Paid Submissions',
      value: paidSubmissionsCount,
      icon: UsersIcon,
      sub: `${submissions.length} total`,
      color: '#A855F7',
    },
    {
      label: 'Menu Items',
      value: availableMenuItemsCount,
      icon: UtensilsIcon,
      sub: `${menuItemsCount} total`,
      color: '#F59E0B',
    },
  ]

  const recentBookings = bookings.slice(-5).reverse()
  const upcomingEvents = events.filter((e) => e.active).slice(0, 3)

  return (
    <div className="min-w-0 max-w-full space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#F5F3EF]">Dashboard</h1>
        <p className="text-[#A0A0A0] mt-1">Welcome to LAMAH HUB Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-[#1E1E1E] rounded-2xl p-4 border border-[#2E2E2E] hover:border-[#D4A95D]/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-[#6B6B6B] hidden sm:block">{stat.sub}</span>
              </div>
              <p className="text-xl lg:text-2xl font-bold text-[#F5F3EF]">{stat.value}</p>
              <p className="text-xs text-[#A0A0A0] mt-1 leading-tight">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Submissions Table */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E]">
        <div className="p-4 lg:p-6 border-b border-[#2E2E2E] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#F5F3EF]">Submissions</h2>
          <span className="text-sm text-[#A0A0A0] bg-[#2E2E2E] px-3 py-1 rounded-full">
            {submissions.length} records
          </span>
        </div>
        <div className="p-4 lg:p-6">
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-[#2E2E2E] flex items-center justify-center mx-auto mb-3">
                <BookingIcon size={20} className="text-[#6B6B6B]" />
              </div>
              <p className="text-[#6B6B6B]">No submissions yet</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {submissions.map((s) => (
                <div key={s.reference} className="rounded-2xl border border-[#2E2E2E] bg-[#121212] p-4">
                  {/* Top row: reference + status badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[#6B6B6B] uppercase tracking-wider mb-1">Reference</p>
                      <p className="font-mono text-sm text-[#D4A95D] break-all leading-snug">{s.reference}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        s.status === 'success'
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-yellow-400/10 text-yellow-400'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  {/* Detail grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-[#1A1A1A] rounded-xl p-2.5">
                      <p className="text-xs text-[#6B6B6B] mb-0.5">Title</p>
                      <p className="text-sm text-[#F5F3EF] truncate">{s.title || '—'}</p>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-xl p-2.5">
                      <p className="text-xs text-[#6B6B6B] mb-0.5">Type</p>
                      <p className="text-sm text-[#F5F3EF] truncate">{s.type || '—'}</p>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-xl p-2.5">
                      <p className="text-xs text-[#6B6B6B] mb-0.5">Amount</p>
                      <p className="text-sm text-[#F5F3EF]">{s.amount ? `₦${Number(s.amount).toLocaleString()}` : '—'}</p>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-xl p-2.5">
                      <p className="text-xs text-[#6B6B6B] mb-0.5">Check-in</p>
                      <p className={`text-sm font-medium ${s.checkedIn ? 'text-green-400' : 'text-[#A0A0A0]'}`}>
                        {s.checkedIn ? '✓ Done' : 'Pending'}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  {s.email && (
                    <p className="text-xs text-[#6B6B6B] mb-3 truncate">
                      <span className="text-[#A0A0A0]">Email: </span>{s.email}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => showQr(s)}
                        className="rounded-xl bg-[#2E2E2E] px-3 py-2 text-xs font-semibold text-[#D4A95D] hover:bg-[#383838] transition-colors"
                      >
                        View QR
                      </button>
                      <button
                        onClick={() => markCheckedIn(s.reference)}
                        disabled={s.checkedIn || checkinLoading === s.reference}
                        className="rounded-xl bg-[#D4A95D] px-3 py-2 text-xs font-semibold text-[#161616] hover:bg-[#E8C070] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {s.checkedIn ? 'Checked In' : checkinLoading === s.reference ? 'Checking...' : 'Check In'}
                      </button>
                    </div>
                    <p className="text-xs text-[#6B6B6B] hidden sm:block">
                      {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Scanner */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#F5F3EF]">QR Scanner</h2>
            <p className="text-sm text-[#A0A0A0] mt-0.5">
              Scan a payment QR or paste the payload to look up booking data.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={startCamera}
              disabled={scannerActive}
              className="flex-1 sm:flex-none rounded-xl bg-[#D4A95D] px-4 py-2.5 text-sm font-semibold text-[#161616] hover:bg-[#E8C070] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Camera
            </button>
            <button
              type="button"
              onClick={stopCamera}
              disabled={!scannerActive}
              className="flex-1 sm:flex-none rounded-xl border border-[#2E2E2E] px-4 py-2.5 text-sm text-[#F5F3EF] hover:bg-[#2E2E2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Stop
            </button>
          </div>
        </div>

        {/* Camera + Status grid */}
        <div className="grid gap-4 lg:grid-cols-[300px_1fr] mb-4">
          {/* Camera preview */}
          <div className="overflow-hidden rounded-2xl border border-[#2E2E2E] bg-[#121212]">
            <div className="relative h-64 lg:h-72 bg-black">
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                playsInline
                muted
                autoPlay
              />
              {!scannerActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
                  <div className="w-16 h-16 rounded-2xl border border-[#2E2E2E] bg-[#1E1E1E] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="1.5">
                      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                      <rect x="7" y="7" width="4" height="4" rx="1" />
                      <rect x="13" y="7" width="4" height="4" rx="1" />
                      <rect x="7" y="13" width="4" height="4" rx="1" />
                      <path d="M13 13h4v4" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#6B6B6B]">Press Start Camera to begin</p>
                </div>
              )}
              {/* Scan overlay */}
              {scannerActive && (
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 border-2 border-[#D4A95D]/30 rounded-2xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-[#D4A95D] rounded-xl" />
                </div>
              )}
            </div>
          </div>

          {/* Status panel */}
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#161616] p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#F5F3EF]">Scanner Status</p>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  scannerActive
                    ? 'bg-emerald-500/10 text-emerald-300'
                    : 'bg-[#2E2E2E] text-[#A0A0A0]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${scannerActive ? 'bg-emerald-400 animate-pulse' : 'bg-[#6B6B6B]'}`} />
                {scannerActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="flex-1 rounded-xl bg-[#121212] border border-[#2E2E2E] p-3">
              <p className="text-sm text-[#F5F3EF] leading-relaxed break-words">{scannerStatus}</p>
            </div>

            {/* Manual input */}
            <div>
              <label className="block text-xs text-[#6B6B6B] mb-2">Manual QR Value</label>
              <div className="flex gap-2">
                <input
                  value={scannerCode}
                  onChange={(e) => setScannerCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && inspectScannerCode()}
                  placeholder="LAMAHHUB:REFERENCE"
                  className="flex-1 min-w-0 rounded-xl bg-[#121212] border border-[#2E2E2E] px-3 py-2.5 text-sm text-[#F5F3EF] placeholder:text-[#4B4B4B] focus:border-[#D4A95D] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={inspectScannerCode}
                  className="flex-shrink-0 rounded-xl bg-[#D4A95D] px-4 py-2.5 text-sm font-semibold text-[#161616] hover:bg-[#E8C070] transition-colors"
                >
                  Inspect
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scanner result dialog */}
        <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
          <DialogContent className="w-full max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {scannerResult?.notFound ? 'No submission found' : 'Submission details'}
              </DialogTitle>
              <DialogDescription>
                {scannerResult?.notFound
                  ? `No data matched for reference: ${scannerResult?.reference}`
                  : 'Review the scanned booking and mark attendance.'}
              </DialogDescription>
            </DialogHeader>

            {scannerResult && (
              <div className="mt-2 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-3">
                    <p className="text-xs text-[#6B6B6B] mb-1">Reference</p>
                    <p className="font-mono text-sm text-[#D4A95D] break-all leading-snug">{scannerResult.reference}</p>
                  </div>
                  <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-3">
                    <p className="text-xs text-[#6B6B6B] mb-1">Status</p>
                    <p className={`text-sm font-medium ${scannerResult.checkedIn ? 'text-green-400' : 'text-[#F5F3EF]'}`}>
                      {scannerResult.checkedIn ? '✓ Checked In' : 'Not checked in'}
                    </p>
                  </div>
                </div>

                {scannerResult.notFound ? (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-400">
                    No submission was found for this reference.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-3">
                      <p className="text-xs text-[#6B6B6B] mb-1">Name</p>
                      <p className="text-sm text-[#F5F3EF] truncate">{scannerResult.name || scannerResult.title || '—'}</p>
                    </div>
                    <div className="rounded-xl border border-[#2E2E2E] bg-[#121212] p-3">
                      <p className="text-xs text-[#6B6B6B] mb-1">Amount</p>
                      <p className="text-sm text-[#F5F3EF]">
                        {scannerResult.amount ? `₦${Number(scannerResult.amount).toLocaleString()}` : '—'}
                      </p>
                    </div>
                    {scannerResult.email && (
                      <div className="col-span-2 rounded-xl border border-[#2E2E2E] bg-[#121212] p-3">
                        <p className="text-xs text-[#6B6B6B] mb-1">Email</p>
                        <p className="text-sm text-[#F5F3EF] break-all">{scannerResult.email}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
              {!scannerResult?.notFound && !scannerResult?.checkedIn && (
                <button
                  type="button"
                  onClick={markScannerCheckedIn}
                  disabled={checkinLoading === scannerResult?.reference}
                  className="w-full sm:w-auto rounded-xl bg-[#D4A95D] px-5 py-2.5 text-sm font-semibold text-[#161616] hover:bg-[#E8C070] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkinLoading === scannerResult?.reference ? 'Checking in…' : 'Mark Checked In'}
                </button>
              )}
              <DialogClose className="w-full sm:w-auto rounded-xl border border-[#2E2E2E] bg-[#121212] px-5 py-2.5 text-sm text-[#F5F3EF] hover:bg-[#2E2E2E] transition-colors">
                Close
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Recent Bookings + Upcoming Events */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-[#2E2E2E] flex items-center justify-between">
            <h2 className="text-base lg:text-lg font-semibold text-[#F5F3EF]">Recent Bookings</h2>
            <BookingIcon size={18} className="text-[#D4A95D]" />
          </div>
          <div className="p-4 lg:p-6">
            {recentBookings.length === 0 ? (
              <p className="text-[#6B6B6B] text-center py-8 text-sm">No bookings yet</p>
            ) : (
              <div className="space-y-2">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#242424]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[#F5F3EF] font-medium text-sm truncate">{booking.customerName}</p>
                      <p className="text-xs text-[#A0A0A0] truncate">{booking.pitchName}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium
                        ${booking.status === 'confirmed' ? 'bg-green-400/10 text-green-400' : ''}
                        ${booking.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' : ''}
                        ${booking.status === 'cancelled' ? 'bg-red-400/10 text-red-400' : ''}
                        ${booking.status === 'completed' ? 'bg-blue-400/10 text-blue-400' : ''}
                      `}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-[#2E2E2E] flex items-center justify-between">
            <h2 className="text-base lg:text-lg font-semibold text-[#F5F3EF]">Upcoming Events</h2>
            <CalendarIcon size={18} className="text-[#D4A95D]" />
          </div>
          <div className="p-4 lg:p-6">
            {upcomingEvents.length === 0 ? (
              <p className="text-[#6B6B6B] text-center py-8 text-sm">No upcoming events</p>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#242424]">
                    <div
                      className="w-10 h-10 rounded-xl bg-cover bg-center flex-shrink-0 bg-[#2E2E2E]"
                      style={event.image ? { backgroundImage: `url(${event.image})` } : {}}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#F5F3EF] font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-[#A0A0A0]">
                        {event.date} · {event.time}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-xs font-semibold text-[#D4A95D]">
                      {event.registered}/{event.capacity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { icon: CalendarIcon, label: 'Payments', value: submissions.length },
          { icon: TrophyIcon, label: 'Pitches', value: pitches.length },
          { icon: CalendarIcon, label: 'Events', value: events.length },
          { icon: UsersIcon, label: 'Total Members', value: members.length },
          { icon: BookingIcon, label: 'Pending', value: bookings.filter((b) => b.status === 'pending').length },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="bg-[#1E1E1E] rounded-xl p-3 lg:p-4 border border-[#2E2E2E]">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={15} className="text-[#D4A95D]" />
                <span className="text-xs text-[#A0A0A0] truncate">{item.label}</span>
              </div>
              <p className="text-xl font-bold text-[#F5F3EF]">{item.value}</p>
            </div>
          )
        })}
      </div>

      {/* QR Preview Modal */}
      {qrPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={closeQr}
        >
          <div
            className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#2E2E2E] max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[#F5F3EF]">QR Code Preview</h3>
              <button
                onClick={closeQr}
                className="text-sm text-[#A0A0A0] hover:text-[#F5F3EF] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#2E2E2E]"
              >
                Close
              </button>
            </div>
            <div className="flex items-center justify-center bg-white rounded-xl p-4">
              {qrLoading ? (
                <p className="text-[#161616] py-8">Generating...</p>
              ) : (
                <img src={qrPreview} alt="QR code" className="w-full max-w-xs h-auto object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}