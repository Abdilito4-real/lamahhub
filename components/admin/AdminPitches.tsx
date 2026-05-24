'use client'

import { useState } from 'react'
import { useAdmin, Pitch } from '@/contexts/AdminContext'
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, XIcon, FootballIcon } from '@/components/lamah/Icons'

export function AdminPitches() {
  const { pitches, addPitch, updatePitch, deletePitch } = useAdmin()
  const [editingItem, setEditingItem] = useState<Pitch | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Omit<Pitch, 'id'>>({
    name: '',
    type: '7-a-side',
    pricePerHour: 0,
    available: true,
    image: '',
  })

  const handleSave = () => {
    if (editingItem) {
      updatePitch(editingItem.id, formData)
      setEditingItem(null)
    } else if (isAdding) {
      addPitch(formData)
      setIsAdding(false)
    }
    setFormData({ name: '', type: '7-a-side', pricePerHour: 0, available: true, image: '' })
  }

  const handleEdit = (item: Pitch) => {
    setEditingItem(item)
    setFormData({ name: item.name, type: item.type, pricePerHour: item.pricePerHour, available: item.available, image: item.image })
    setIsAdding(false)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingItem(null)
    setFormData({ name: '', type: '7-a-side', pricePerHour: 0, available: true, image: '' })
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
          <h1 className="text-2xl lg:text-3xl font-bold text-[#F5F3EF]">Pitches</h1>
          <p className="text-[#A0A0A0] mt-1">{pitches.length} pitches</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A95D] text-[#161616] rounded-xl font-medium hover:bg-[#E5BA6E] transition-colors"
        >
          <PlusIcon size={18} />
          Add Pitch
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingItem) && (
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#D4A95D]/30 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4">
            {editingItem ? 'Edit Pitch' : 'Add New Pitch'}
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
              <label className="block text-sm text-[#A0A0A0] mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Pitch['type'] })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              >
                <option value="5-a-side">5-a-side</option>
                <option value="7-a-side">7-a-side</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Price Per Hour (N)</label>
              <input
                type="number"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: Number(e.target.value) })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-[#A0A0A0]">Available</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, available: !formData.available })}
                className={`w-12 h-6 rounded-full transition-colors ${formData.available ? 'bg-[#D4A95D]' : 'bg-[#2E2E2E]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${formData.available ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#A0A0A0] mb-1">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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

      {/* Pitches Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {pitches.map((pitch) => (
          <div key={pitch.id} className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] overflow-hidden hover:border-[#D4A95D]/30 transition-colors">
            <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url(${pitch.image})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${pitch.available ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                  {pitch.available ? 'Available' : 'Unavailable'}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-[#D4A95D]/20 text-[#D4A95D]">
                  {pitch.type}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#F5F3EF] font-semibold text-lg">{pitch.name}</h3>
                  <p className="text-[#D4A95D] font-bold mt-1">N{pitch.pricePerHour?.toLocaleString() ?? '0'}/hr</p>
                </div>
                <FootballIcon size={32} className="text-[#2E2E2E]" />
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(pitch)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#242424] text-[#A0A0A0] hover:text-[#D4A95D] hover:bg-[#2E2E2E] transition-colors">
                  <EditIcon size={16} />
                  Edit
                </button>
                <button onClick={() => deletePitch(pitch.id)} className="p-2 rounded-xl bg-[#242424] text-[#A0A0A0] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {pitches.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E]">
            <FootballIcon size={48} className="mx-auto text-[#2E2E2E] mb-4" />
            <p className="text-[#6B6B6B]">No pitches found</p>
          </div>
        )}
      </div>
    </div>
  )
}
