// app/admin/layout.tsx
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminNav from '@/components/AdminNav'


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allow={['admin']}>
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <AdminNav />
            {/* <div className="flex items-center gap-4">
              <RoleSwitcher />
            </div> */}
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
