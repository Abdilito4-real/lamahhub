'use client'

import { useEffect, useMemo, useState } from 'react'

interface GalleryImage {
  id: string | number
  src: string
  category?: string
  title?: string
}

const defaultGalleryImages: GalleryImage[] = []

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(defaultGalleryImages)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await fetch('/api/public/gallery', { cache: 'no-store' })
        if (response.ok) {
          const body = await response.json()
          setGalleryImages(body.gallery || defaultGalleryImages)
          return
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load gallery images:', error)
      } finally {
        setIsLoading(false)
      }
      setGalleryImages(defaultGalleryImages)
    }

    loadGallery()
  }, [])

  const categories = useMemo(() => [
    'All',
    ...Array.from(new Set(galleryImages.map((image) => image.category).filter(Boolean)))
  ], [galleryImages])

  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory)

  return (
    <section id="gallery" className="py-24 md:py-32 bg-[#1A1A1A] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[#D4A95D] text-sm tracking-[0.3em] uppercase mb-4 block">Visual Journey</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F3EF] mb-6">
            Our <span className="text-[#D4A95D]">Gallery</span>
          </h2>
          <p className="text-[#A0A0A0] text-lg max-w-2xl mx-auto">
            Explore the elegance and sophistication of LAMAH HUB through our curated collection of images.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-[#D4A95D] text-[#161616]'
                  : 'bg-[#1E1E1E] text-[#A0A0A0] hover:text-[#F5F3EF] border border-[#2E2E2E]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Gallery */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredImages.map((image, idx) => (
            <div
              key={image.id}
              className={`break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden ${
                idx % 3 === 0 ? 'aspect-[4/5]' : idx % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-[#161616]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-[#D4A95D] text-xs uppercase tracking-wider block mb-2">{image.category}</span>
                  <h4 className="text-[#F5F3EF] font-bold text-xl">{image.title}</h4>
                  <div className="mt-4 w-12 h-12 rounded-full bg-[#D4A95D]/20 flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-[#D4A95D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161616]/95 backdrop-blur-lg"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-[#F5F3EF] hover:text-[#D4A95D] transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
            <div className="mt-4 text-center">
              <span className="text-[#D4A95D] text-sm uppercase tracking-wider block mb-1">{selectedImage.category}</span>
              <h4 className="text-[#F5F3EF] font-bold text-2xl">{selectedImage.title}</h4>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
