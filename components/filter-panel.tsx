"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import type { SearchFilters } from "@/lib/types"
import { X } from "lucide-react"

interface FilterPanelProps {
  filters: SearchFilters
  onFiltersChange: (filters: Partial<SearchFilters>) => void
}

export function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters)

  const amenityOptions = [
    "Free WiFi",
    "Power Outlets",
    "Quiet Zone",
    "Study Rooms",
    "Group Tables",
    "Outdoor Seating",
    "24/7 Hours",
    "Printing Services",
    "Meeting Rooms",
    "Whiteboards",
  ]

  const noiseLevelOptions = [
    { value: "quiet", label: "Quiet" },
    { value: "moderate", label: "Moderate" },
    { value: "loud", label: "Loud" },
  ]

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = localFilters.amenities || []
    const newAmenities = checked ? [...currentAmenities, amenity] : currentAmenities.filter((a) => a !== amenity)

    const updatedFilters = { ...localFilters, amenities: newAmenities.length > 0 ? newAmenities : undefined }
    setLocalFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handlePriceLevelChange = (level: number, checked: boolean) => {
    const currentLevels = localFilters.priceLevel || []
    const newLevels = checked ? [...currentLevels, level] : currentLevels.filter((l) => l !== level)

    const updatedFilters = { ...localFilters, priceLevel: newLevels.length > 0 ? newLevels : undefined }
    setLocalFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handleNoiseLevelChange = (level: string, checked: boolean) => {
    const currentLevels = localFilters.noiseLevel || []
    const newLevels = checked ? [...currentLevels, level] : currentLevels.filter((l) => l !== level)

    const updatedFilters = { ...localFilters, noiseLevel: newLevels.length > 0 ? newLevels : undefined }
    setLocalFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handleRatingChange = (value: number[]) => {
    const updatedFilters = { ...localFilters, rating: value[0] }
    setLocalFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handleDistanceChange = (value: number[]) => {
    const updatedFilters = { ...localFilters, distance: value[0] }
    setLocalFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const handleToggleChange = (key: keyof SearchFilters, value: boolean) => {
    const updatedFilters = { ...localFilters, [key]: value }
    setLocalFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const clearAllFilters = () => {
    const clearedFilters = { location: localFilters.location } // Keep location
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (localFilters.amenities?.length) count++
    if (localFilters.priceLevel?.length) count++
    if (localFilters.noiseLevel?.length) count++
    if (localFilters.rating) count++
    if (localFilters.distance) count++
    if (localFilters.studyFriendly) count++
    if (localFilters.openNow) count++
    return count
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {getActiveFilterCount() > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Quick Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="study-friendly">Study Friendly</Label>
          <Switch
            id="study-friendly"
            checked={localFilters.studyFriendly || false}
            onCheckedChange={(checked) => handleToggleChange("studyFriendly", checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="open-now">Open Now</Label>
          <Switch
            id="open-now"
            checked={localFilters.openNow || false}
            onCheckedChange={(checked) => handleToggleChange("openNow", checked)}
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <Label>Minimum Rating: {localFilters.rating || 0} stars</Label>
        <Slider
          value={[localFilters.rating || 0]}
          onValueChange={handleRatingChange}
          max={5}
          min={0}
          step={0.5}
          className="w-full"
        />
      </div>

      {/* Distance Filter */}
      {localFilters.location && (
        <div className="space-y-3">
          <Label>Distance: {localFilters.distance || 25} miles</Label>
          <Slider
            value={[localFilters.distance || 25]}
            onValueChange={handleDistanceChange}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {/* Price Level */}
      <div className="space-y-3">
        <Label>Price Level</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${level}`}
                checked={localFilters.priceLevel?.includes(level) || false}
                onCheckedChange={(checked) => handlePriceLevelChange(level, checked as boolean)}
              />
              <Label htmlFor={`price-${level}`} className="text-sm">
                {"$".repeat(level)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Noise Level */}
      <div className="space-y-3">
        <Label>Noise Level</Label>
        <div className="space-y-2">
          {noiseLevelOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`noise-${option.value}`}
                checked={localFilters.noiseLevel?.includes(option.value) || false}
                onCheckedChange={(checked) => handleNoiseLevelChange(option.value, checked as boolean)}
              />
              <Label htmlFor={`noise-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <Label>Amenities</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {amenityOptions.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={localFilters.amenities?.includes(amenity) || false}
                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
              />
              <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="space-y-2">
          <Label>Active Filters ({getActiveFilterCount()})</Label>
          <div className="flex flex-wrap gap-1">
            {localFilters.amenities?.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => handleAmenityChange(amenity, false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {localFilters.studyFriendly && (
              <Badge variant="secondary" className="text-xs">
                Study Friendly
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => handleToggleChange("studyFriendly", false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {localFilters.openNow && (
              <Badge variant="secondary" className="text-xs">
                Open Now
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => handleToggleChange("openNow", false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
