'use client'

import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { XIcon, RefreshIcon } from '@/components/lamah/Icons'
import { toast } from 'sonner'

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(true)
  const isScanningRef = useRef(true)
  const [error, setError] = useState<string | null>(null)
  const requestRef = useRef<number>()

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.setAttribute('playsinline', 'true')
          videoRef.current.play()
          requestRef.current = requestAnimationFrame(tick)
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
        setError('Could not access camera. Please ensure you have given permission.')
      }
    }

    startVideo()

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const video = videoRef.current
        canvas.height = video.videoHeight
        canvas.width = video.videoWidth
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          })

          if (code) {
            onScan(code.data)
            setIsScanning(false)
            isScanningRef.current = false
            return // Stop ticking after a successful scan
          }
        }
      }
    }
    if (isScanningRef.current) {
      requestRef.current = requestAnimationFrame(tick)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#161616] rounded-[32px] border border-[#2E2E2E] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#2E2E2E] flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#F5F3EF]">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#2E2E2E] text-[#6B6B6B] hover:text-[#F5F3EF] transition-colors"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="relative aspect-square bg-black overflow-hidden">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4A95D] text-[#161616] font-bold"
              >
                <RefreshIcon size={18} />
                Retry
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanner Overlay */}
              <div className="absolute inset-0 border-[40px] border-black/40">
                <div className="w-full h-full border-2 border-[#D4A95D] rounded-3xl relative">
                  {/* Laser effect */}
                  <div className="scanner-laser" />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 text-center">
          <p className="text-[#A0A0A0] text-sm">
            Position the QR code within the frame to scan automatically.
          </p>
        </div>
      </div>
    </div>
  )
}
