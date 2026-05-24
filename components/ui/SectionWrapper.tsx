'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionWrapperProps = {
  id?: string
  title?: string
  subtitle?: string
  className?: string
  children: ReactNode
}

export function SectionWrapper({ id, title, subtitle, className, children }: SectionWrapperProps) {
  return (
    <section id={id} className={cn('py-20 md:py-28 relative overflow-hidden', className)}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && (
              <span className="text-[#D4A95D] text-sm tracking-[0.3em] uppercase mb-4 block">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5F3EF] leading-tight">
                {title}
              </h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
