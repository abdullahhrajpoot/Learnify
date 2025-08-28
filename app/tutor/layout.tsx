import type { ReactNode } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import TutorNav from '@/components/TutorNav'

export default function TutorLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allow={['tutor']}>
      <div className="min-h-screen flex flex-col">
        <header className="border-b p-4">
          <TutorNav />
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
