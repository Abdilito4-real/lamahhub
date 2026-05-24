'use client'

import { useEffect, useState, type FormEvent } from 'react'

interface MembershipTier {
  id: string | number
  name: string
  price?: string | number
  period?: string
  benefits?: string[]
  popular?: boolean
  description?: string
}

type MembershipFormData = {
  name: string
  email: string
  phone: string
  notes: string
}

const defaultTiers: MembershipTier[] = []

export function MembershipSection() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [registrationCompleted, setRegistrationCompleted] = useState(false)
  const [formData, setFormData] = useState<MembershipFormData>({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [paymentError, setPaymentError] = useState('')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>(defaultTiers)
  const [isLoadingTiers, setIsLoadingTiers] = useState(true)

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await fetch('/api/public/membership-tiers', { cache: 'no-store' })
        if (!response.ok) return
        const body = await response.json()
        setMembershipTiers(body.tiers || defaultTiers)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load membership tiers:', error)
        setMembershipTiers(defaultTiers)
      } finally {
        setIsLoadingTiers(false)
      }
    }

    fetchTiers()
  }, [])

  const parseAmount = (price?: string | number) => {
    if (typeof price === 'number') return price
    if (!price) return 0
    return Number(price.toString().replace(/[^\\d]/g, '')) || 0
  }

  const openSignup = (tier: string) => {
    setSelectedTier(tier)
    setRegistrationCompleted(false)
    setPaymentError('')
    setFormData({ name: '', email: '', phone: '', notes: '' })
  }

  const closeSignup = () => {
    setSelectedTier(null)
    setRegistrationCompleted(false)
    setPaymentError('')
    setIsProcessingPayment(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedTier) return

    setPaymentError('')
    setIsProcessingPayment(true)

    const selectedPlan = membershipTiers.find((tier) => tier.name === selectedTier)
    const amount = selectedPlan ? parseAmount(selectedPlan.price) : 0

    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          amount,
          name: formData.name,
          phone: formData.phone,
          type: 'membership',
          itemId: selectedTier,
          title: `${selectedTier} Membership`,
          notes: formData.notes,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setPaymentError(data.error || 'Unable to start payment. Please try again.')
        setIsProcessingPayment(false)
        return
      }

      if (!data.authorization_url) {
        setPaymentError('Paystack did not return a payment URL.')
        setIsProcessingPayment(false)
        return
      }

      window.location.href = data.authorization_url
    } catch (error) {
      setPaymentError('Payment initialization failed. Please try again.')
      setIsProcessingPayment(false)
    }
  }

  return (
    <section id="membership" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#D4A95D]/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4A95D] text-sm tracking-[0.3em] uppercase mb-4 block">Exclusive Access</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F3EF] mb-6">
            VIP <span className="text-[#D4A95D]">Membership</span>
          </h2>
          <p className="text-[#A0A0A0] text-lg max-w-2xl mx-auto">
            Unlock premium benefits, priority access, and exclusive discounts with our membership programs.
          </p>
        </div>

        {/* Membership Tiers */}
        <div className="grid md:grid-cols-3 gap-8">
          {membershipTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 transition-all ${
                tier.popular
                  ? 'bg-gradient-to-b from-[#D4A95D]/20 to-[#1E1E1E] border-2 border-[#D4A95D] scale-105'
                  : 'bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#D4A95D]/30'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D4A95D] text-[#161616] text-xs font-bold uppercase tracking-wider rounded-full">
                  Most Popular
                </div>
              )}

              {/* Tier Name */}
              <h3 className="text-2xl font-bold text-[#F5F3EF] mb-2">{tier.name}</h3>
              
              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#D4A95D]">{tier.price}</span>
                <span className="text-[#A0A0A0]">{tier.period}</span>
              </div>

              {/* Benefits */}
              <ul className="space-y-4 mb-8">
                {(tier.benefits || []).slice(0, 5).map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[#A0A0A0] text-sm">
                    <span className="mt-1 text-[#D4A95D]">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => openSignup(tier.name)}
                className={`w-full py-4 rounded-xl font-semibold transition-colors ${
                  tier.popular
                    ? 'bg-[#D4A95D] text-[#161616] hover:bg-[#F5F3EF]'
                    : 'border border-[#D4A95D] text-[#D4A95D] hover:bg-[#D4A95D] hover:text-[#161616]'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Corporate Membership */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#1E1E1E] to-[#242424] border border-[#2E2E2E]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[#D4A95D] text-sm uppercase tracking-wider block mb-2">For Businesses</span>
              <h4 className="text-2xl font-bold text-[#F5F3EF] mb-2">Corporate Membership</h4>
              <p className="text-[#A0A0A0] max-w-lg">
                Custom packages for companies. Team building events, corporate hospitality, and exclusive benefits for your organization.
              </p>
            </div>
            <button className="px-8 py-4 bg-[#D4A95D] text-[#161616] rounded-xl font-semibold hover:bg-[#F5F3EF] transition-colors whitespace-nowrap">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161616]/90 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] border border-[#2E2E2E] bg-[#1E1E1E] p-8 shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-3xl font-bold text-[#F5F3EF]">Join {selectedTier} Membership</h3>
                <p className="text-sm text-[#A0A0A0] mt-2">Fill in your details to start your VIP membership.</p>
              </div>
              <button onClick={closeSignup} className="text-[#A0A0A0] hover:text-[#F5F3EF]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!registrationCompleted ? (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A0A0A0] text-sm mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      required
                      className="w-full rounded-2xl border border-[#2E2E2E] bg-[#161616] p-4 text-[#F5F3EF] outline-none focus:border-[#D4A95D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A0A0A0] text-sm mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-2xl border border-[#2E2E2E] bg-[#161616] p-4 text-[#F5F3EF] outline-none focus:border-[#D4A95D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A0A0A0] text-sm mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 812 345 6789"
                      required
                      className="w-full rounded-2xl border border-[#2E2E2E] bg-[#161616] p-4 text-[#F5F3EF] outline-none focus:border-[#D4A95D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A0A0A0] text-sm mb-2">Membership Tier</label>
                    <input
                      type="text"
                      value={selectedTier}
                      disabled
                      className="w-full rounded-2xl border border-[#2E2E2E] bg-[#161616] p-4 text-[#A0A0A0] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A0A0A0] text-sm mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    placeholder="Any preferences or questions"
                    className="w-full rounded-2xl border border-[#2E2E2E] bg-[#161616] p-4 text-[#F5F3EF] outline-none focus:border-[#D4A95D]"
                  />
                </div>

                {paymentError ? (
                  <p className="text-sm text-red-400">{paymentError}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full rounded-2xl bg-[#D4A95D] py-4 text-[#161616] font-semibold hover:bg-[#F5F3EF] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? 'Starting payment...' : 'Confirm VIP Membership'}
                </button>
              </form>
            ) : (
              <div className="rounded-3xl border border-[#D4A95D] bg-[#161616] p-8 text-center text-[#F5F3EF]">
                <p className="text-2xl font-bold">Membership registered!</p>
                <p className="mt-4 text-[#A0A0A0]">Thanks, {formData.name || 'member'}. Your {selectedTier} membership request has been received.</p>
                <button onClick={closeSignup} className="mt-6 rounded-2xl bg-[#D4A95D] px-8 py-3 text-[#161616] font-semibold hover:bg-[#F5F3EF] transition-colors">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
