import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LAMAH HUB | Kaduna\'s Premier Lifestyle Destination',
  description: 'Experience luxury sports, leisure, electric mobility, fine dining, and premium entertainment at LAMAH HUB - Kaduna\'s newest lifestyle destination powered by KB Lamar Motors.',
  keywords: ['LAMAH HUB', 'Kaduna', 'sports', 'football pitches', 'EV showroom', 'electric vehicles', 'restaurant', 'lounge', 'nightlife', 'Nigeria'],
  authors: [{ name: 'KB Lamar Motors' }],
  openGraph: {
    title: 'LAMAH HUB | Kaduna\'s Premier Lifestyle Destination',
    description: 'Sports. Leisure. Innovation. Mobility.',
    type: 'website',
    locale: 'en_NG',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#161616',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-[#161616] text-[#F5F3EF]">
        {children}
      </body>
    </html>
  )
}
