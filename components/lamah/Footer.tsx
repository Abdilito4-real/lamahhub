import Link from 'next/link'

export function Footer() {
  const footerLinks = {
    'Experience': [
      { name: 'Football Pitches', href: '#pitches' },
      { name: 'EV Showroom', href: '#ev-showroom' },
      { name: 'Restaurant', href: '#dining' },
      { name: 'Lounge & Bar', href: '#dining' },
      { name: 'VIP Rooms', href: '#membership' },
    ],
    'Services': [
      { name: 'Book a Pitch', href: '#booking' },
      { name: 'Test Drive', href: '#ev-showroom' },
      { name: 'Reservations', href: '#dining' },
      { name: 'Membership', href: '#membership' },
      { name: 'Events', href: '#events' },
    ],
    'Company': [
      { name: 'About Us', href: '#about' },
      { name: 'Gallery', href: '#gallery' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#contact' },
      { name: 'Privacy Policy', href: '#' },
    ],
  }

  return (
    <footer className="bg-[#0D0D0D] pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4A95D] to-[#6B4F3A] flex items-center justify-center">
                <span className="text-[#161616] font-bold text-xl">LH</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#F5F3EF] font-bold tracking-wider text-xl">LAMAH HUB</span>
                <span className="text-[#D4A95D] text-xs tracking-[0.2em] uppercase">Lifestyle Destination</span>
              </div>
            </Link>
            <p className="text-[#A0A0A0] mb-6 max-w-sm">
              Kaduna&apos;s premier lifestyle destination. Sports, leisure, electric mobility, and fine dining 
              - all under one roof. Powered by KB Lamar Motors.
            </p>
            
            {/* Newsletter */}
            <div>
              <h4 className="text-[#F5F3EF] font-semibold mb-3">Subscribe to our newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-[#1E1E1E] border border-[#2E2E2E] text-[#F5F3EF] placeholder-[#555] focus:border-[#D4A95D] focus:outline-none transition-colors"
                />
                <button className="px-6 py-3 bg-[#D4A95D] text-[#161616] rounded-lg font-semibold hover:bg-[#F5F3EF] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[#F5F3EF] font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-[#A0A0A0] hover:text-[#D4A95D] transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2E2E2E] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#A0A0A0] text-sm">
            © {new Date().getFullYear()} LAMAH HUB. All rights reserved. Powered by KB Lamar Motors.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#A0A0A0] hover:text-[#D4A95D] text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-[#A0A0A0] hover:text-[#D4A95D] text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#A0A0A0] hover:text-[#D4A95D] text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
