'use client'

import { useState } from 'react'
import { useAdmin, EVVehicle } from '@/contexts/AdminContext'
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, XIcon, CheckIcon, CarIcon } from '@/components/lamah/Icons'

export function AdminVehicles() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useAdmin()
  const [search, setSearch] = useState('')
  const [editingItem, setEditingItem] = useState<EVVehicle | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Omit<EVVehicle, 'id'>>({
    name: '',
    price: 0,
    range: '',
    topSpeed: '',
    acceleration: '',
    image: '',
    features: [],
    available: true,
  })
  const [featureInput, setFeatureInput] = useState('')

  const filteredVehicles = vehicles.filter((v) =>
    v.name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = () => {
    if (editingItem) {
      updateVehicle(editingItem.id, formData)
      setEditingItem(null)
    } else if (isAdding) {
      addVehicle(formData)
      setIsAdding(false)
    }
    setFormData({ name: '', price: 0, range: '', topSpeed: '', acceleration: '', image: '', features: [], available: true })
  }

  const handleEdit = (item: EVVehicle) => {
    setEditingItem(item)
    setFormData({ name: item.name, price: item.price, range: item.range, topSpeed: item.topSpeed, acceleration: item.acceleration, image: item.image, features: item.features, available: item.available })
    setIsAdding(false)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingItem(null)
    setFormData({ name: '', price: 0, range: '', topSpeed: '', acceleration: '', image: '', features: [], available: true })
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsAdding(false)
    setFormData({ name: '', price: 0, range: '', topSpeed: '', acceleration: '', image: '', features: [], available: true })
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#F5F3EF]">EV Showroom</h1>
          <p className="text-[#A0A0A0] mt-1">{vehicles.length} vehicles</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A95D] text-[#161616] rounded-xl font-medium hover:bg-[#E5BA6E] transition-colors"
        >
          <PlusIcon size={18} />
          Add Vehicle
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vehicles..."
          className="w-full bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl py-2.5 pl-11 pr-4 text-[#F5F3EF] placeholder-[#6B6B6B] focus:border-[#D4A95D] focus:outline-none"
        />
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingItem) && (
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#D4A95D]/30 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4">
            {editingItem ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#A0A0A0] mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Price (N)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Range</label>
              <input
                type="text"
                value={formData.range}
                onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                placeholder="e.g., 637 km"
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Top Speed</label>
              <input
                type="text"
                value={formData.topSpeed}
                onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
                placeholder="e.g., 322 km/h"
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Acceleration</label>
              <input
                type="text"
                value={formData.acceleration}
                onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
                placeholder="e.g., 2.1s 0-100"
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
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
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#A0A0A0] mb-1">Features</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  placeholder="Add feature..."
                  className="flex-1 bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-[#242424] text-[#A0A0A0] rounded-xl hover:bg-[#2E2E2E] transition-colors"
                >
                  <PlusIcon size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span key={index} className="flex items-center gap-1 px-3 py-1 bg-[#242424] rounded-lg text-sm text-[#A0A0A0]">
                    {feature}
                    <button type="button" onClick={() => removeFeature(index)} className="hover:text-red-400">
                      <XIcon size={14} />
                    </button>
                  </span>
                ))}
              </div>
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

      {/* Vehicles Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] overflow-hidden hover:border-[#D4A95D]/30 transition-colors">
            <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${vehicle.image})` }}>
              {!vehicle.available && (
                <div className="h-full flex items-center justify-center bg-black/60">
                  <span className="px-3 py-1 rounded-full bg-red-400/20 text-red-400 text-sm">Not Available</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-[#F5F3EF] font-semibold text-lg">{vehicle.name}</h3>
              <p className="text-[#D4A95D] font-bold mt-1">N{vehicle.price?.toLocaleString() ?? '0'}</p>
              <div className="flex flex-wrap gap-2 mt-3 text-xs text-[#A0A0A0]">
                <span className="px-2 py-1 bg-[#242424] rounded">{vehicle.range}</span>
                <span className="px-2 py-1 bg-[#242424] rounded">{vehicle.topSpeed}</span>
                <span className="px-2 py-1 bg-[#242424] rounded">{vehicle.acceleration}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(vehicle)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#242424] text-[#A0A0A0] hover:text-[#D4A95D] hover:bg-[#2E2E2E] transition-colors">
                  <EditIcon size={16} />
                  Edit
                </button>
                <button onClick={() => deleteVehicle(vehicle.id)} className="p-2 rounded-xl bg-[#242424] text-[#A0A0A0] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredVehicles.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <CarIcon size={48} className="mx-auto text-[#2E2E2E] mb-4" />
            <p className="text-[#6B6B6B]">No vehicles found</p>
          </div>
        )}
      </div>
    </div>
  )
}
