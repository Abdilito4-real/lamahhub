'use client'

import { useState } from 'react'
import { useAdmin, GalleryImage } from '@/contexts/AdminContext'
import { PlusIcon, TrashIcon, ImageIcon, CheckIcon, XIcon, StarIcon } from '@/components/lamah/Icons'

export function AdminGallery() {
  const { galleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage } = useAdmin()
  const [filter, setFilter] = useState<string>('all')
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Omit<GalleryImage, 'id'>>({
    url: '',
    category: 'all',
    caption: '',
    featured: false,
  })

  const categories = ['all', 'sports', 'ev', 'dining', 'events']

  const filteredImages = galleryImages.filter(img => 
    filter === 'all' || img.category === filter
  )

  const handleSave = () => {
    if (isAdding && formData.url) {
      addGalleryImage(formData)
      setIsAdding(false)
      setFormData({ url: '', category: 'all', caption: '', featured: false })
    }
  }

  const toggleFeatured = (id: string, current: boolean) => {
    updateGalleryImage(id, { featured: !current })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#F5F3EF]">Gallery</h1>
          <p className="text-[#A0A0A0] mt-1">{galleryImages.length} images</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A95D] text-[#161616] rounded-xl font-medium hover:bg-[#E5BA6E] transition-colors"
        >
          <PlusIcon size={18} />
          Add Image
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
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

      {/* Add Form */}
      {isAdding && (
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#D4A95D]/30 p-4 lg:p-6">
          <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4">Add New Image</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#A0A0A0] mb-1">Image URL</label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as GalleryImage['category'] })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#A0A0A0] mb-1">Caption</label>
              <input
                type="text"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-[#A0A0A0]">Featured</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                className={`w-12 h-6 rounded-full transition-colors ${formData.featured ? 'bg-[#D4A95D]' : 'bg-[#2E2E2E]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${formData.featured ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#D4A95D] text-[#161616] rounded-xl font-medium hover:bg-[#E5BA6E] transition-colors">
              <CheckIcon size={18} />
              Save
            </button>
            <button onClick={() => setIsAdding(false)} className="flex items-center gap-2 px-4 py-2 bg-[#2E2E2E] text-[#A0A0A0] rounded-xl font-medium hover:bg-[#3E3E3E] transition-colors">
              <XIcon size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <div key={image.id} className="group relative rounded-xl overflow-hidden bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#D4A95D]/30 transition-colors">
            <div 
              className="aspect-square bg-cover bg-center"
              style={{ backgroundImage: `url(${image.url})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="text-[#F5F3EF] text-sm font-medium truncate">{image.caption}</p>
              <p className="text-[#6B6B6B] text-xs">{image.category}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => toggleFeatured(image.id, image.featured)}
                className={`p-1.5 rounded-lg transition-colors ${image.featured ? 'bg-[#D4A95D] text-[#161616]' : 'bg-black/50 text-[#A0A0A0] hover:text-[#D4A95D]'}`}
              >
                <StarIcon size={14} />
              </button>
              <button
                onClick={() => deleteGalleryImage(image.id)}
                className="p-1.5 rounded-lg bg-black/50 text-[#A0A0A0] hover:text-red-400 transition-colors"
              >
                <TrashIcon size={14} />
              </button>
            </div>
            {image.featured && (
              <div className="absolute top-2 left-2">
                <StarIcon size={16} className="text-[#D4A95D]" />
              </div>
            )}
          </div>
        ))}
        {filteredImages.length === 0 && (
          <div className="col-span-full text-center py-12 bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E]">
            <ImageIcon size={48} className="mx-auto text-[#2E2E2E] mb-4" />
            <p className="text-[#6B6B6B]">No images found</p>
          </div>
        )}
      </div>
    </div>
  )
}
