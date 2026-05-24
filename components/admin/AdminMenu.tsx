'use client'

import { useState } from 'react'
import { useAdmin, MenuItem } from '@/contexts/AdminContext'
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, XIcon, CheckIcon } from '@/components/lamah/Icons'

export function AdminMenu() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useAdmin()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'starters',
    available: true,
  })

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || item.category === filter
    return matchesSearch && matchesFilter
  })

  const categories = ['all', 'starters', 'mains', 'desserts', 'drinks']

  const handleSave = () => {
    if (editingItem) {
      updateMenuItem(editingItem.id, formData)
      setEditingItem(null)
    } else if (isAdding) {
      addMenuItem(formData)
      setIsAdding(false)
    }
    setFormData({ name: '', description: '', price: 0, category: 'starters', available: true })
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({ name: item.name, description: item.description, price: item.price, category: item.category, available: item.available })
    setIsAdding(false)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingItem(null)
    setFormData({ name: '', description: '', price: 0, category: 'starters', available: true })
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsAdding(false)
    setFormData({ name: '', description: '', price: 0, category: 'starters', available: true })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#F5F3EF]">Menu Management</h1>
          <p className="text-[#A0A0A0] mt-1">{menuItems.length} items</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A95D] text-[#161616] rounded-xl font-medium hover:bg-[#E5BA6E] transition-colors"
        >
          <PlusIcon size={18} />
          Add Item
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items..."
            className="w-full bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl py-2.5 pl-11 pr-4 text-[#F5F3EF] placeholder-[#6B6B6B] focus:border-[#D4A95D] focus:outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors
                ${filter === cat 
                  ? 'bg-[#D4A95D] text-[#161616]' 
                  : 'bg-[#1E1E1E] text-[#A0A0A0] hover:bg-[#242424]'}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingItem) && (
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#D4A95D]/30 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4">
            {editingItem ? 'Edit Item' : 'Add New Item'}
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
              <label className="block text-sm text-[#A0A0A0] mb-1">Price (N)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#A0A0A0] mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as MenuItem['category'] })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              >
                <option value="starters">Starters</option>
                <option value="mains">Mains</option>
                <option value="desserts">Desserts</option>
                <option value="drinks">Drinks</option>
              </select>
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
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-[#D4A95D] text-[#161616] rounded-xl font-medium hover:bg-[#E5BA6E] transition-colors"
            >
              <CheckIcon size={18} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-[#2E2E2E] text-[#A0A0A0] rounded-xl font-medium hover:bg-[#3E3E3E] transition-colors"
            >
              <XIcon size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div 
            key={item.id}
            className="bg-[#1E1E1E] rounded-xl border border-[#2E2E2E] p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-[#D4A95D]/30 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[#F5F3EF] font-medium">{item.name}</h3>
                {!item.available && (
                  <span className="px-2 py-0.5 rounded text-xs bg-red-400/10 text-red-400">Unavailable</span>
                )}
              </div>
              <p className="text-sm text-[#6B6B6B] mt-1">{item.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-[#D4A95D] font-semibold">N{item.price?.toLocaleString() ?? '0'}</span>
                <span className="text-xs text-[#6B6B6B] px-2 py-0.5 bg-[#242424] rounded">{item.category}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 rounded-lg bg-[#242424] text-[#A0A0A0] hover:text-[#D4A95D] hover:bg-[#2E2E2E] transition-colors"
              >
                <EditIcon size={18} />
              </button>
              <button
                onClick={() => deleteMenuItem(item.id)}
                className="p-2 rounded-lg bg-[#242424] text-[#A0A0A0] hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <TrashIcon size={18} />
              </button>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <p className="text-center text-[#6B6B6B] py-12">No items found</p>
        )}
      </div>
    </div>
  )
}
