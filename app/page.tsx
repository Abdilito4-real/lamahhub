import { Navigation } from '@/components/lamah/Navigation'
import { HeroSection } from '@/components/lamah/HeroSection'
import { AboutSection } from '@/components/lamah/AboutSection'
import { ExperienceZones } from '@/components/lamah/ExperienceZones'
import { LivePitchAvailability } from '@/components/lamah/LivePitchAvailability'
import { BookingSection } from '@/components/lamah/BookingSection'
import { EVShowroom } from '@/components/lamah/EVShowroom'
import { DiningSection } from '@/components/lamah/DiningSection'
import { EventsSection } from '@/components/lamah/EventsSection'
import { GallerySection } from '@/components/lamah/GallerySection'
import { MembershipSection } from '@/components/lamah/MembershipSection'
import { ContactSection } from '@/components/lamah/ContactSection'
import { Footer } from '@/components/lamah/Footer'

export default function LamahHubPage() {
  return (
    <main className="min-h-screen bg-[#161616]">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ExperienceZones />
      <LivePitchAvailability />
      <BookingSection />
      <EVShowroom />
      <DiningSection />
      <EventsSection />
      <GallerySection />
      <MembershipSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
