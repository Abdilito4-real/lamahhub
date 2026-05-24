'use client'

import { useState } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { EditIcon, CheckIcon, XIcon, MailIcon, PhoneIcon, MapPinIcon } from '@/components/lamah/Icons'

export function AdminSettings() {
  const { settings, updateSettings } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(settings)

  const handleSave = () => {
    updateSettings(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(settings)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#F5F3EF]">Site Settings</h1>
          <p className="text-[#A0A0A0] mt-1">Manage your website content</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4A95D] text-[#161616] rounded-xl font-medium hover:bg-[#E5BA6E] transition-colors"
          >
            <EditIcon size={18} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
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
        )}
      </div>

      {/* Hero Section */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-[#F5F3EF] mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#A0A0A0] mb-1">Hero Title</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            ) : (
              <p className="text-[#F5F3EF]">{settings.heroTitle}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-[#A0A0A0] mb-1">Hero Subtitle</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            ) : (
              <p className="text-[#F5F3EF]">{settings.heroSubtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-[#F5F3EF] mb-4">About Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#A0A0A0] mb-1">About Title</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.aboutTitle}
                onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            ) : (
              <p className="text-[#F5F3EF]">{settings.aboutTitle}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-[#A0A0A0] mb-1">About Description</label>
            {isEditing ? (
              <textarea
                rows={4}
                value={formData.aboutDescription}
                onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none resize-none"
              />
            ) : (
              <p className="text-[#F5F3EF]">{settings.aboutDescription}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-[#F5F3EF] mb-4">Contact Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-[#A0A0A0] mb-1">
              <MailIcon size={14} />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            ) : (
              <p className="text-[#F5F3EF]">{settings.contactEmail}</p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-[#A0A0A0] mb-1">
              <PhoneIcon size={14} />
              Phone
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            ) : (
              <p className="text-[#F5F3EF]">{settings.contactPhone}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-[#A0A0A0] mb-1">
              <MapPinIcon size={14} />
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            ) : (
              <p className="text-[#F5F3EF]">{settings.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-[#2E2E2E] p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-[#F5F3EF] mb-4">Social Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#A0A0A0] mb-1">Instagram</label>
            {isEditing ? (
              <input
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            ) : (
              <p className="text-[#F5F3EF] truncate">{settings.socialLinks.instagram}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-[#A0A0A0] mb-1">Twitter</label>
            {isEditing ? (
              <input
                type="url"
                value={formData.socialLinks.twitter}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitter: e.target.value } })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            ) : (
              <p className="text-[#F5F3EF] truncate">{settings.socialLinks.twitter}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-[#A0A0A0] mb-1">Facebook</label>
            {isEditing ? (
              <input
                type="url"
                value={formData.socialLinks.facebook}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, facebook: e.target.value } })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            ) : (
              <p className="text-[#F5F3EF] truncate">{settings.socialLinks.facebook}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-[#A0A0A0] mb-1">WhatsApp</label>
            {isEditing ? (
              <input
                type="url"
                value={formData.socialLinks.whatsapp}
                onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, whatsapp: e.target.value } })}
                className="w-full bg-[#161616] border border-[#2E2E2E] rounded-xl py-2.5 px-4 text-[#F5F3EF] focus:border-[#D4A95D] focus:outline-none"
              />
            ) : (
              <p className="text-[#F5F3EF] truncate">{settings.socialLinks.whatsapp}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
