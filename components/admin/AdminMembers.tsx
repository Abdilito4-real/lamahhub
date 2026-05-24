'use client'

import { useState } from 'react'
import { useAdmin, Member } from '@/contexts/AdminContext'
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, XIcon, CheckIcon, UsersIcon, CrownIcon } from '@/components/lamah/Icons'

export function AdminMembers() {
  const { members, addMember, updateMember, deleteMember, membershipTiers } = useAdmin()
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [editingItem, setEditingItem] = useState<Member | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    name: '',
    email: '',
    phone: '',
    tier: 'silver',
    joinDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'active',
    totalSpent: 0,
  })

  const tiers = ['all', 'silver', 'gold', 'platinum', 'corporate']

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase())
    const matchesTier = tierFilter === 'all' || m.tier === tierFilter
    return matchesSearch && matchesTier
  })

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'silver': return 'bg-gray-400/10 text-gray-400 border-gray-400/30'
      case 'gold': return 'bg-[#D4A95D]/10 text-[#D4A95D] border-[#D4A95D]/30'
      case 'platinum': return 'bg-purple-400/10 text-purple-400 border-purple-400/30'
      case 'corporate': return 'bg-blue-400/10 text-blue-400 border-blue-400/30'
      default: return 'bg-[#2E2E2E] text-[#A0A0A0]'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400/10 text-green-400'
      case 'expired': return 'bg-red-400/10 text-red-400'
      case 'pending': return 'bg-yellow-400/10 text-yellow-400'
      default: return 'bg-[#2E2E2E] text-[#A0A0A0]'
    }
  }

  const handleSave = () => {
    if (editingItem) {
      updateMember(editingItem.id, formData)
      setEditingItem(null)
    } else if (isAdding) {
      addMember(formData)
      setIsAdding(false)
    }
    setFormData({ name: '', email: '', phone: '', tier: 'silver', joinDate: new Date().toISOString().split('T')[0], expiryDate: '', status: 'active', totalSpent: 0 })
  }

  const handleEdit = (item: Member) => {
    setEditingItem(item)
    setFormData({ name: item.name, email: item.email, phone: item.phone, tier: item.tier, joinDate: item.joinDate, expiryDate: item.expiryDate, status: item.status, totalSpent: item.totalSpent })
    setIsAdding(false)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingItem(null)
    setFormData({ name: '', email: '', phone: '', tier: 'silver', joinDate: new Date().toISOString().split('T')[0], expiryDate: '', status: 'active', totalSpent: 0 })
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsAdding(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#F5F3EF]">Members</h1>
          <p className="text-[#A0A0A0] mt-1">{members.length} members</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A95D] text-[#161616] rounded-xl font-medium hover:bg-[#E5BA6E] transition-colors"
        >
          <PlusIcon size={18} />
          Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.slice(1).map((tier) => (
          <div key={tier} className="bg-[#1E1E1E] rounded-xl p-4 border border-[#2E2E2E]">
            <div className="flex items-center gap-2 mb-2">
              <CrownIcon size={16} className={tier === 'gold' ? 'text-[#D4A95D]' : tier === 'platinum' ? 'text-purple-400' : tier === 'corporate' ? 'text-blue-400' : 'text-gray-400'} />
              <span className="text-sm text-[#A0A0A0] capitalize">{tier}</span>
            </div>
            <p className="text-2xl font-bold text-[#F5F3EF]">
              {members.filter(m => m.tier === tier).length}
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
            placeholder="Search members..."
            className="w-full bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl py-2.5 pl-11 pr-4 text-[#F5F3EF] placeholder-[#6B6B6B] focus:border-[#D4A95D] focus:outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors capitalize
                ${tierFilter === tier 
                  ? 'bg-[#D4A95D] text-[#161616]' 
                  : 'bg-[#1E1E1E] text-[#A0A0A0] hover:bg-[#242424]'}`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingItem) && (
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#D4A95D]/30 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4">
            {editingItem ? 'Edit Member' : 'Add New Member'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value as Member['tier'] })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              >
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Join Date</label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Member['status'] })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Total Spent (N)</label>
              <input
                type="number"
                value={formData.totalSpent}
                onChange={(e) => setFormData({ ...formData, totalSpent: Number(e.target.value) })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#D4A95D] text-[#161616] rounded-xl font-medium hover:bg-[#E5BA6E] transition-colors">
              <CheckIcon size={18} />
              Save
            </button>
            <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-[#2E2E2E] text-[#A0A0A0] rounded-xl font-medium hover:bg-[#3E3E3E] transition-colors">
              <XIcon size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-3">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12 bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E]">
            <UsersIcon size={48} className="mx-auto text-[#2E2E2E] mb-4" />
            <p className="text-[#6B6B6B]">No members found</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div key={member.id} className="bg-[#1E1E1E] rounded-xl border border-[#2E2E2E] p-4 hover:border-[#D4A95D]/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-[#F5F3EF] font-semibold">{member.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getTierColor(member.tier)}`}>
                      {member.tier}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#A0A0A0]">{member.email}</p>
                  <p className="text-sm text-[#6B6B6B]">{member.phone}</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                  <div className="text-[#A0A0A0]">
                    <span className="text-[#6B6B6B]">Joined:</span> {member.joinDate}
                  </div>
                  <div className="text-[#A0A0A0]">
                    <span className="text-[#6B6B6B]">Expires:</span> {member.expiryDate || 'N/A'}
                  </div>
                  <div className="text-[#D4A95D] font-semibold">
                    N{member.totalSpent?.toLocaleString() ?? '0'} spent
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(member)} className="p-2 rounded-lg bg-[#242424] text-[#A0A0A0] hover:text-[#D4A95D] hover:bg-[#2E2E2E] transition-colors">
                    <EditIcon size={16} />
                  </button>
                  <button onClick={() => deleteMember(member.id)} className="p-2 rounded-lg bg-[#242424] text-[#A0A0A0] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
