"use client"

import type { Cafe } from "@/lib/types"
import { CafeCard } from "./cafe-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { MapPin, AlertCircle } from "lucide-react"
import { calculateDistance } from "@/lib/utils/cafe-utils"

interface CafeListProps {
  cafes: Cafe[]
  selectedCafeId: string | null
  onCafeSelect: (cafeId: string) => void
  isLoading: boolean
  error?: any
  userLocation: { lat: number; lng: number } | null
}

export function CafeList({ cafes, selectedCafeId, onCafeSelect, isLoading, error, userLocation }: CafeListProps) {
  const handleRetry = () => {
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2 text-muted-foreground">
          <LoadingSpinner />
          Loading cafés...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <EmptyState
          icon={<AlertCircle className="h-12 w-12" />}
          title="Failed to Load Cafés"
          description="We couldn't load the café list. Please check your connection and try again."
          action={{
            label: "Try Again",
            onClick: handleRetry,
          }}
        />
      </div>
    )
  }

  if (cafes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <EmptyState
          icon={<MapPin className="h-12 w-12" />}
          title="No Cafés Found"
          description="No cafés match your current search criteria. Try adjusting your filters or search terms."
          action={{
            label: "Clear Filters",
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b bg-muted/20">
        <h2 className="font-semibold text-sm text-muted-foreground">
          {cafes.length} {cafes.length === 1 ? "café" : "cafés"} found
        </h2>
      </div>

      <div className="divide-y">
        {cafes.map((cafe) => {
          const distance = userLocation
            ? calculateDistance(userLocation.lat, userLocation.lng, cafe.latitude, cafe.longitude)
            : undefined

          return (
            <CafeCard
              key={cafe.id}
              cafe={cafe}
              isSelected={selectedCafeId === cafe.id}
              onClick={() => onCafeSelect(cafe.id)}
              distance={distance}
            />
          )
        })}
      </div>
    </div>
  )
}
