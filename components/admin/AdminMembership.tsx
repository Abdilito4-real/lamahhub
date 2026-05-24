'use client'

import { useState } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { EditIcon, CheckIcon, XIcon, CrownIcon, StarIcon } from '@/components/lamah/Icons'

export function AdminMembership() {
  const { membershipTiers, updateMembershipTier } = useAdmin()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{ name: string; price: number; features: string[] }>({
    name: '',
    price: 0,
    features: [],
  })
  const [featureInput, setFeatureInput] = useState('')

  const handleEdit = (tier: typeof membershipTiers[0]) => {
    setEditingId(tier.id)
    setFormData({ name: tier.name, price: tier.price, features: [...tier.features] })
  }

  const handleSave = () => {
    if (editingId) {
      updateMembershipTier(editingId, formData)
      setEditingId(null)
      setFormData({ name: '', price: 0, features: [] })
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: '', price: 0, features: [] })
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] })
      setFeatureInput('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
  }

  const getTierColor = (name: string) => {
    switch (name?.toLowerCase()) {
      case 'silver': return { bg: 'from-gray-400/20 to-gray-600/20', border: 'border-gray-400/30', icon: 'text-gray-400' }
      case 'gold': return { bg: 'from-[#D4A95D]/20 to-[#B8860B]/20', border: 'border-[#D4A95D]/30', icon: 'text-[#D4A95D]' }
      case 'platinum': return { bg: 'from-purple-400/20 to-purple-600/20', border: 'border-purple-400/30', icon: 'text-purple-400' }
      default: return { bg: 'from-[#2E2E2E] to-[#1E1E1E]', border: 'border-[#2E2E2E]', icon: 'text-[#A0A0A0]' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#F5F3EF]">Membership Tiers</h1>
        <p className="text-[#A0A0A0] mt-1">Manage VIP membership packages and pricing</p>
      </div>

      {/* Tiers Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {membershipTiers.map((tier) => {
          const colors = getTierColor(tier.name)
          const isEditing = editingId === tier.id

          return (
            <div 
              key={tier.id}
              className={`relative bg-gradient-to-br ${colors.bg} rounded-2xl border ${colors.border} p-6 transition-all hover:scale-[1.02]`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D4A95D] text-[#161616] text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#A0A0A0] mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2 px-3 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#A0A0A0] mb-1">Price (N/year)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2 px-3 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#A0A0A0] mb-1">Features</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        placeholder="Add feature..."
                        className="flex-1 bg-[#161616] border border-[#2E2E2E] rounded-xl py-2 px-3 text-[#F5F3EF] text-sm focus:border-[#D4A95D] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-3 py-2 bg-[#242424] text-[#A0A0A0] rounded-xl hover:bg-[#2E2E2E] transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between px-3 py-1.5 bg-[#161616] rounded-lg text-sm">
                          <span className="text-[#A0A0A0]">{feature}</span>
                          <button type="button" onClick={() => removeFeature(index)} className="text-red-400 hover:text-red-300">
                            <XIcon size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#D4A95D] text-[#161616] rounded-xl font-medium hover:bg-[#E5BA6E] transition-colors">
                      <CheckIcon size={16} />
                      Save
                    </button>
                    <button onClick={handleCancel} className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#2E2E2E] text-[#A0A0A0] rounded-xl font-medium hover:bg-[#3E3E3E] transition-colors">
                      <XIcon size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <CrownIcon size={32} className={colors.icon} />
                    <button
                      onClick={() => handleEdit(tier)}
                      className="p-2 rounded-lg bg-[#161616]/50 text-[#A0A0A0] hover:text-[#D4A95D] hover:bg-[#161616] transition-colors"
                    >
                      <EditIcon size={16} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-[#F5F3EF] mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold text-[#D4A95D]">N{tier.price?.toLocaleString() ?? '0'}</span>
                    <span className="text-[#6B6B6B]">/{tier.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[#A0A0A0]">
                        <CheckIcon size={16} className={`flex-shrink-0 mt-0.5 ${colors.icon}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Corporate Membership Info */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
            <StarIcon size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#F5F3EF]">Corporate Membership</h3>
            <p className="text-sm text-[#A0A0A0]">Custom packages for businesses</p>
          </div>
        </div>
        <p className="text-[#6B6B6B] text-sm mb-4">
          Corporate memberships are tailored to each organization&apos;s needs. Contact the sales team for custom pricing and packages including team access, event hosting, and exclusive corporate benefits.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-400/10 text-blue-400 rounded-lg text-sm">Bulk Discounts</span>
          <span className="px-3 py-1 bg-blue-400/10 text-blue-400 rounded-lg text-sm">Team Access</span>
          <span className="px-3 py-1 bg-blue-400/10 text-blue-400 rounded-lg text-sm">Event Hosting</span>
          <span className="px-3 py-1 bg-blue-400/10 text-blue-400 rounded-lg text-sm">Dedicated Support</span>
        </div>
      </div>
    </div>
  )
}
