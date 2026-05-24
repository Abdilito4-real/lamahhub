'use client'

import { useEffect, useState } from 'react'

type PaymentStatus = 'loading' | 'success' | 'failed' | 'missing'

type SubmissionPayload = {
  reference: string
  type: 'event' | 'membership' | 'booking' | 'other'
  itemId: string
  title: string
  name: string
  email: string
  phone: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  qrText: string
  payload: any
}

export default function PaymentCallbackPage() {
  const [reference, setReference] = useState<string | null>(null)
  const [status, setStatus] = useState<PaymentStatus>('loading')
  const [message, setMessage] = useState('Verifying your transaction, please wait...')
  const [qrSrc, setQrSrc] = useState<string | null>(null)
  const [submissionReference, setSubmissionReference] = useState<string | null>(null)
  const [transactionAmount, setTransactionAmount] = useState<number | null>(null)
  const [itemTitle, setItemTitle] = useState<string | null>(null)

  const downloadQr = () => {
    if (!qrSrc) return
    const link = document.createElement('a')
    link.href = qrSrc
    link.download = `LAMAHHUB-${submissionReference || 'receipt'}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    if (!reference && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setReference(params.get('reference'))
      return
    }
    const verifyPayment = async () => {
      if (!reference) {
        setStatus('missing')
        setMessage('No payment reference found in the callback URL.')
        return
      }

      try {
        const verifyRes = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
        const verifyJson = await verifyRes.json()

        if (!verifyRes.ok || !verifyJson.transaction) {
          setStatus('failed')
          setMessage(verifyJson.error || 'Unable to verify payment.')
          return
        }

        const transaction = verifyJson.transaction
        const metadata = transaction.metadata ?? {}
        const email = transaction.customer?.email ?? metadata.email ?? ''
        const name = metadata.name ?? ''
        const phone = metadata.phone ?? ''
        const amountNGN = transaction.amount ? transaction.amount / 100 : 0
        const itemId = metadata.itemId ?? ''
        const title = metadata.title ?? 'Payment'
        const qrText = `LAMAHHUB:${transaction.reference}`

        const submission: SubmissionPayload = {
          reference: transaction.reference,
          type: metadata.type ?? 'other',
          itemId,
          title,
          name,
          email,
          phone,
          amount: amountNGN,
          status: transaction.status === 'success' ? 'success' : 'failed',
          qrText,
          payload: transaction,
        }

        if (submission.status !== 'success') {
          setStatus('failed')
          setMessage('Payment verification failed or payment was not successful.')
          return
        }

        await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission),
        })

        // Dynamically import QR code library to avoid client-bundle issues
        try {
          const qrcode = await import('qrcode')
          const qrUrl = await qrcode.toDataURL(qrText)
          setQrSrc(qrUrl)
        } catch (e) {
          setQrSrc(null)
        }
        setSubmissionReference(transaction.reference)
        setTransactionAmount(amountNGN)
        setItemTitle(title)
        setStatus('success')
        setMessage('Payment verified successfully. Your membership/booking is confirmed.')
      } catch (error) {
        setStatus('failed')
        setMessage('An error occurred while verifying your payment. Please try again later.')
      }
    }

    verifyPayment()
  }, [reference])

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F5F3EF] px-6 py-20">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-[#2E2E2E] bg-[#161616]/95 p-10 shadow-2xl shadow-black/40">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-[#D4A95D]">Payment Callback</p>
          <h1 className="mt-4 text-4xl font-bold">{status === 'loading' ? 'Verifying payment...' : status === 'success' ? 'Payment confirmed' : 'Payment failed'}</h1>
          <p className="mt-3 text-[#A0A0A0]">{message}</p>
        </div>

        {status === 'success' && (
          <div className="space-y-8">
            {qrSrc && (
              <div className="mx-auto w-56 rounded-3xl bg-[#1E1E1E] p-6 border border-[#2E2E2E]">
                <img src={qrSrc} alt="Payment QR code" className="mx-auto" />
                <button
                  onClick={downloadQr}
                  className="w-full mt-4 px-4 py-2 rounded-xl bg-[#D4A95D] text-[#161616] font-semibold hover:bg-[#F5F3EF] transition-colors text-sm"
                >
                  Download QR
                </button>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-[#2E2E2E] bg-[#1E1E1E] p-5">
                <p className="text-sm text-[#A0A0A0]">Reference</p>
                <p className="mt-2 font-semibold text-[#F5F3EF] break-all">{submissionReference}</p>
                <p className="mt-3 text-xs text-[#F5F3EF]/80">Keep this payment reference safe — the admin may use it to validate your transaction.</p>
              </div>
              <div className="rounded-3xl border border-[#2E2E2E] bg-[#1E1E1E] p-5">
                <p className="text-sm text-[#A0A0A0]">Item</p>
                <p className="mt-2 font-semibold text-[#F5F3EF]">{itemTitle}</p>
              </div>
              <div className="rounded-3xl border border-[#2E2E2E] bg-[#1E1E1E] p-5">
                <p className="text-sm text-[#A0A0A95]">Amount</p>
                <p className="mt-2 font-semibold text-[#F5F3EF]">₦{transactionAmount?.toLocaleString()}</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#D4A95D]/20 bg-[#1A1A1A] p-6 text-center">
              <p className="text-[#A0A0A0]">Give this QR code or the payment reference to the admin for verification.</p>
            </div>
          </div>
        )}

        {status === 'loading' && (
          <div className="rounded-[28px] border border-[#F59E0B]/20 bg-[#1A1A1A] p-6 text-center">
            <p className="text-[#F59E0B] font-semibold">⚠️ Please wait</p>
            <p className="mt-2 text-[#A0A0A0]">Your payment is being verified. Do not close this page. After verification, <span className="font-semibold text-[#D4A95D]">download your QR code</span> for check-in.</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="rounded-3xl border border-[#F87171] bg-[#1E1E1E] p-6 text-center text-[#F87171]">
            <p className="font-semibold">Transaction not verified.</p>
            <p className="mt-2 text-[#A0A0A0]">If you were charged, please contact support and share the payment reference.</p>
          </div>
        )}

        {status === 'missing' && (
          <div className="rounded-3xl border border-[#F87171] bg-[#1E1E1E] p-6 text-center text-[#F87171]">
            <p className="font-semibold">Missing payment reference.</p>
            <p className="mt-2 text-[#A0A0A0]">Please return to the site and try the payment process again.</p>
          </div>
        )}

        {status !== 'loading' && (
          <div className="mt-10 text-center">
            <a href="/" className="inline-flex items-center justify-center rounded-2xl border border-[#D4A95D] px-6 py-3 text-sm font-semibold text-[#D4A95D] hover:bg-[#D4A95D] hover:text-[#161616] transition-colors">
              Return to Home
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
