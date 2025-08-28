"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function LoadingDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <Skeleton className="h-8 w-48 rounded-md" />

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 rounded-2xl shadow-sm">
            <CardContent className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links skeleton */}
      <Card className="p-6 space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-lg" />
          ))}
        </div>
      </Card>

      {/* Activity Section skeleton */}
      <Card className="p-6 space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-3/4" />
      </Card>
    </div>
  )
}
