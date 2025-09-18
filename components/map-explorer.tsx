"use client"

import { useState, useEffect } from "react"
import { SearchBar } from "./search-bar"
import { FilterPanel } from "./filter-panel"
import { CafeList } from "./cafe-list"
import { MapView } from "./map-view"
import { SetupNotice } from "./ui/setup-notice"
import { useCafes } from "@/lib/hooks/use-cafes"
import type { SearchFilters } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal, List, Map } from "lucide-react"

interface MapExplorerProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

export function MapExplorer({ filters, onFiltersChange }: MapExplorerProps) {
  const [view, setView] = useState<"map" | "list" | "split">("split")
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const { cafes, isLoading, error } = useCafes(filters)

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          // Update filters with user location for distance calculations
          onFiltersChange({ ...filters, location })
        },
        (error) => {
          console.log("Location access denied:", error)
          // Default to Orange County center
          const defaultLocation = { lat: 33.7175, lng: -117.8311 }
          setUserLocation(defaultLocation)
          onFiltersChange({ ...filters, location: defaultLocation })
        },
      )
    }
  }, [])

  const handleSearch = (query: string) => {
    onFiltersChange({ ...filters, query })
  }

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...newFilters })
  }

  const handleCafeSelect = (cafeId: string) => {
    setSelectedCafeId(cafeId)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="border-b bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">Study Café Locator</h1>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span>{cafes.length} cafés found</span>
              {userLocation && <span>• Orange County, CA</span>}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex border rounded-lg p-1">
              <Button
                variant={view === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("map")}
                className="px-3"
              >
                <Map className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "split" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("split")}
                className="px-3"
              >
                Split
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile View Toggle */}
            <div className="md:hidden flex border rounded-lg p-1">
              <Button variant={view === "map" ? "default" : "ghost"} size="sm" onClick={() => setView("map")}>
                <Map className="h-4 w-4" />
              </Button>
              <Button variant={view === "list" ? "default" : "ghost"} size="sm" onClick={() => setView("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} initialValue={filters.query} />
          </div>

          {/* Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="shrink-0 bg-transparent">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <FilterPanel filters={filters} onFiltersChange={handleFilterChange} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Setup Notice */}
        <div className="mt-4">
          <SetupNotice />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map View */}
        {(view === "map" || view === "split") && (
          <div className={`${view === "split" ? "flex-1" : "w-full"} relative`}>
            <MapView
              cafes={cafes}
              selectedCafeId={selectedCafeId}
              onCafeSelect={handleCafeSelect}
              userLocation={userLocation}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* List View */}
        {(view === "list" || view === "split") && (
          <div className={`${view === "split" ? "w-96 border-l" : "w-full"} bg-card`}>
            <CafeList
              cafes={cafes}
              selectedCafeId={selectedCafeId}
              onCafeSelect={handleCafeSelect}
              isLoading={isLoading}
              error={error}
              userLocation={userLocation}
            />
          </div>
        )}
      </div>
    </div>
  )
}
