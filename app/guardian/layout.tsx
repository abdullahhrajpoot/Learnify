// import ProtectedRoute from '@/components/ProtectedRoute'

// export default function GuardianLayout({ children }: { children: React.ReactNode }) {
//   return <ProtectedRoute allow={['guardian']}>{children}</ProtectedRoute>
// }
// app/guardian/layout.tsx
import ProtectedRoute from '@/components/ProtectedRoute'
import type { ReactNode } from 'react'
import GuardianNav from '@/components/GuardianNav'

export default function GuardianLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allow={['guardian']}>
      <div className="min-h-screen flex flex-col">
        <header className="border-b p-4">
          <GuardianNav />
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
