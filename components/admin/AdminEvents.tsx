'use client'

import { useState } from 'react'
import { useAdmin, Event } from '@/contexts/AdminContext'
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, XIcon, CheckIcon, CalendarIcon } from '@/components/lamah/Icons'

export function AdminEvents() {
  const { events, addEvent, updateEvent, deleteEvent } = useAdmin()
  const [search, setSearch] = useState('')
  const [editingItem, setEditingItem] = useState<Event | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    category: 'sports',
    price: 0,
    image: '',
    capacity: 0,
    registered: 0,
    active: true,
  })

  const filteredEvents = events.filter((e) =>
    e.title?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = () => {
    if (editingItem) {
      updateEvent(editingItem.id, formData)
      setEditingItem(null)
    } else if (isAdding) {
      addEvent(formData)
      setIsAdding(false)
    }
    setFormData({ title: '', description: '', date: '', time: '', category: 'sports', price: 0, image: '', capacity: 0, registered: 0, active: true })
  }

  const handleEdit = (item: Event) => {
    setEditingItem(item)
    setFormData({ title: item.title, description: item.description, date: item.date, time: item.time, category: item.category, price: item.price, image: item.image, capacity: item.capacity, registered: item.registered, active: item.active })
    setIsAdding(false)
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingItem(null)
    setFormData({ title: '', description: '', date: '', time: '', category: 'sports', price: 0, image: '', capacity: 0, registered: 0, active: true })
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsAdding(false)
  }

  const categories = ['sports', 'social', 'music', 'corporate']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#F5F3EF]">Events</h1>
          <p className="text-[#A0A0A0] mt-1">{events.length} events</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A95D] text-[#161616] rounded-xl font-medium hover:bg-[#E5BA6E] transition-colors"
        >
          <PlusIcon size={18} />
          Add Event
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events..."
          className="w-full bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl py-2.5 pl-11 pr-4 text-[#F5F3EF] placeholder-[#6B6B6B] focus:border-[#D4A95D] focus:outline-none"
        />
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingItem) && (
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#D4A95D]/30 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4">
            {editingItem ? 'Edit Event' : 'Add New Event'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#A0A0A0] mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#A0A0A0] mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Event['category'] })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
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
              <label className="block text-sm text-[#A0A0A0] mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Registered</label>
              <input
                type="number"
                value={formData.registered}
                onChange={(e) => setFormData({ ...formData, registered: Number(e.target.value) })}
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
            <div className="flex items-center gap-3">
              <label className="text-sm text-[#A0A0A0]">Active</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, active: !formData.active })}
                className={`w-12 h-6 rounded-full transition-colors ${formData.active ? 'bg-[#D4A95D]' : 'bg-[#2E2E2E]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${formData.active ? 'translate-x-6' : 'translate-x-0.5'}`} />
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

      {/* Events Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] overflow-hidden hover:border-[#D4A95D]/30 transition-colors">
            <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url(${event.image})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${event.active ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                  {event.active ? 'Active' : 'Inactive'}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-[#D4A95D]/20 text-[#D4A95D]">
                  {event.category}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-[#F5F3EF] font-semibold">{event.title}</h3>
              <p className="text-sm text-[#6B6B6B] mt-1 line-clamp-2">{event.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-[#A0A0A0]">
                <span className="flex items-center gap-1">
                  <CalendarIcon size={14} className="text-[#D4A95D]" />
                  {event.date}
                </span>
                <span className="text-[#D4A95D] font-semibold">N{event.price?.toLocaleString() ?? '0'}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-[#6B6B6B]">{event.registered}/{event.capacity} registered</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(event)} className="p-2 rounded-lg bg-[#242424] text-[#A0A0A0] hover:text-[#D4A95D] hover:bg-[#2E2E2E] transition-colors">
                    <EditIcon size={16} />
                  </button>
                  <button onClick={() => deleteEvent(event.id)} className="p-2 rounded-lg bg-[#242424] text-[#A0A0A0] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E]">
            <CalendarIcon size={48} className="mx-auto text-[#2E2E2E] mb-4" />
            <p className="text-[#6B6B6B]">No events found</p>
          </div>
        )}
      </div>
    </div>
  )
}
