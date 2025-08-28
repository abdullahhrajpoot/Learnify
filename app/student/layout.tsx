// import ProtectedRoute from '@/components/ProtectedRoute'

// export default function StudentLayout({ children }: { children: React.ReactNode }) {
//   return <ProtectedRoute allow={['student']}>{children}</ProtectedRoute>
// }
import type { ReactNode } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import StudentNav from "@/components/StudentNav"

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allow={['student']}>
      <div className="min-h-screen flex flex-col">
        <header className="border-b p-4">
          <StudentNav />
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
