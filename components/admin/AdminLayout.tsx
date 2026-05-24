'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdmin } from '@/contexts/AdminContext'
import { AdminLogin } from './AdminLogin'
import {
  DashboardIcon,
  UtensilsIcon,
  CarIcon,
  FootballIcon,
  BookingIcon,
  CalendarIcon,
  UsersIcon,
  CrownIcon,
  ImageIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  ChevronRightIcon,
} from '@/components/lamah/Icons'

const navItems = [
  { href: '/admin', icon: DashboardIcon, label: 'Dashboard' },
  { href: '/admin/menu', icon: UtensilsIcon, label: 'Menu' },
  { href: '/admin/vehicles', icon: CarIcon, label: 'EV Showroom' },
  { href: '/admin/pitches', icon: FootballIcon, label: 'Pitches' },
  { href: '/admin/bookings', icon: BookingIcon, label: 'Bookings' },
  { href: '/admin/events', icon: CalendarIcon, label: 'Events' },
  { href: '/admin/members', icon: UsersIcon, label: 'Members' },
  { href: '/admin/membership', icon: CrownIcon, label: 'Membership Tiers' },
  { href: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
  { href: '/admin/settings', icon: SettingsIcon, label: 'Site Settings' },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const { isAdmin, adminLogout, isLoadingAdminData, adminDataError } = useAdmin()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isAdmin) {
    return <AdminLogin />
  }

  const currentPage = navItems.find((item) => item.href === pathname)?.label ?? 'Admin'

  return (
    <div className="min-h-screen bg-[#161616] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-[#1A1A1A] border-r border-[#2E2E2E]
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[#2E2E2E] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#F5F3EF]">
              LAMAH<span className="text-[#D4A95D]">HUB</span>
            </span>
          </Link>
          {/* Close button – mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#6B6B6B] hover:text-[#F5F3EF] hover:bg-[#2E2E2E] transition-colors"
            aria-label="Close sidebar"
          >
            <XIcon size={18} />
          </button>
        </div>
        <p className="px-5 py-2 text-[#6B6B6B] text-xs border-b border-[#2E2E2E]">Admin Dashboard</p>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${
                        isActive
                          ? 'bg-[#D4A95D]/10 text-[#D4A95D] border border-[#D4A95D]/20'
                          : 'text-[#9A9A9A] hover:bg-[#242424] hover:text-[#F5F3EF] border border-transparent'
                      }
                    `}
                  >
                    <Icon size={17} className="flex-shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {isActive && <ChevronRightIcon size={14} className="flex-shrink-0 opacity-60" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#2E2E2E] space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#9A9A9A] hover:bg-[#242424] hover:text-[#F5F3EF] transition-all"
          >
            <ChevronRightIcon size={17} className="rotate-180 flex-shrink-0" />
            <span>View Site</span>
          </Link>
          <button
            onClick={adminLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOutIcon size={17} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#1A1A1A] border-b border-[#2E2E2E]">
          <div className="flex items-center justify-between px-4 py-3 gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex-shrink-0 p-2 rounded-xl hover:bg-[#2E2E2E] transition-colors"
              aria-label="Open menu"
            >
              <MenuIcon size={20} className="text-[#F5F3EF]" />
            </button>

            {/* Current page title */}
            <div className="flex-1 min-w-0 text-center">
              <span className="text-sm font-semibold text-[#F5F3EF] truncate block">{currentPage}</span>
            </div>

            <button
              onClick={adminLogout}
              className="flex-shrink-0 p-2 rounded-xl hover:bg-red-400/10 transition-colors"
              aria-label="Logout"
            >
              <LogOutIcon size={18} className="text-red-400" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto min-w-0">
          {isLoadingAdminData ? (
            <div className="h-full min-h-[60vh] flex items-center justify-center">
              <div className="rounded-3xl bg-[#1E1E1E] border border-[#2E2E2E] p-10 text-center shadow-sm max-w-sm w-full mx-auto">
                <div className="mx-auto mb-5 h-10 w-10 rounded-full border-4 border-[#2E2E2E] border-t-[#D4A95D] animate-spin" />
                <p className="text-[#F5F3EF] text-base font-semibold">Loading admin data…</p>
                <p className="text-[#A0A0A0] text-sm mt-2">Fetching the latest dashboard and table data.</p>
              </div>
            </div>
          ) : (
            <>
              {adminDataError && (
                <div className="mb-5 rounded-2xl bg-[#1E1E1E] border border-red-400/20 p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-400 text-sm font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-[#F5F3EF] text-sm font-semibold">Admin data warning</p>
                    <p className="text-[#A0A0A0] text-sm mt-0.5">{adminDataError}</p>
                  </div>
                </div>
              )}
              {children}
            </>
          )}
        </div>
      </main>
    </div>
  )
}