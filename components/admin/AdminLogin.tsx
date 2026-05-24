'use client'

import { useState } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { useToast } from '@/hooks/use-toast'
import { Spinner } from '@/components/ui/spinner'
import { LockIcon, EyeIcon } from '@/components/lamah/Icons'

export function AdminLogin() {
  const { adminLogin } = useAdmin()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      const message = 'Please enter both email and password.'
      setError(message)
      toast({ title: 'Missing credentials', description: message, variant: 'destructive' })
      return
    }

    setError('')
    setLoading(true)

    const result = await adminLogin(email.trim(), password)
    setLoading(false)

    if (result !== true) {
      setError(result)
      toast({ title: 'Login failed', description: result, variant: 'destructive' })
      setPassword('')
      return
    }

    toast({ title: 'Welcome back', description: 'Redirecting to the admin dashboard…' })
  }

  return (
    <div className="min-h-screen bg-[#161616] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#F5F3EF] mb-2">
            LAMAH<span className="text-[#D4A95D]">HUB</span>
          </h1>
          <p className="text-[#A0A0A0]">Admin Dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-[#1E1E1E] rounded-2xl p-8 border border-[#2E2E2E]">
          <div className="mb-6">
            <label className="block text-[#A0A0A0] text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-3 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none transition-colors mb-4"
              placeholder="admin@yourdomain.com"
            />

            <label className="block text-[#A0A0A0] text-sm mb-2">Password</label>
            <div className="relative">
              <LockIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-3 pl-12 pr-12 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none transition-colors"
                placeholder="Enter admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#D4A95D] transition-colors"
              >
                <EyeIcon size={20} />
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-colors ${loading ? 'bg-[#AFA073] text-[#161616] cursor-not-allowed' : 'bg-[#D4A95D] text-[#161616] hover:bg-[#E5BA6E]'}`}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Spinner className="text-[#161616]" />
                Signing in...
              </>
            ) : (
              'Access Dashboard'
            )}
          </button>
          
          <p className="text-[#6B6B6B] text-xs text-center mt-6">
            Demo: use a Supabase user + add them to the `admins` table
          </p>
        </form>
      </div>
    </div>
  )
}
