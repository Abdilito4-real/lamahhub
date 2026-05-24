import { AdminProvider } from '@/contexts/AdminContext'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Toaster } from '@/components/ui/toaster'

export const metadata = {
  title: 'Admin Dashboard | LAMAH HUB',
  description: 'Admin dashboard for LAMAH HUB management',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      <AdminLayout>{children}</AdminLayout>
      <Toaster />
    </AdminProvider>
  )
}
