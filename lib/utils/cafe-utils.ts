import type { Cafe, SearchFilters } from "@/lib/types"

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Check if a café is currently open based on its hours
 */
export function isOpenNow(hours: Record<string, string>): boolean {
  const now = new Date()
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() as keyof typeof hours
  const currentTime = now.getHours() * 60 + now.getMinutes() // minutes since midnight

  const todayHours = hours[currentDay]

  if (!todayHours || todayHours.toLowerCase() === "closed") {
    return false
  }

  if (todayHours === "24 Hours") {
    return true
  }

  // Parse hours like "7:00 AM - 10:00 PM"
  const timeRange = todayHours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!timeRange) {
    return false
  }

  const [, openHour, openMin, openPeriod, closeHour, closeMin, closePeriod] = timeRange

  // Convert to 24-hour format
  let openTime = Number.parseInt(openHour) * 60 + Number.parseInt(openMin)
  let closeTime = Number.parseInt(closeHour) * 60 + Number.parseInt(closeMin)

  if (openPeriod.toUpperCase() === "PM" && Number.parseInt(openHour) !== 12) {
    openTime += 12 * 60
  }
  if (openPeriod.toUpperCase() === "AM" && Number.parseInt(openHour) === 12) {
    openTime = Number.parseInt(openMin)
  }

  if (closePeriod.toUpperCase() === "PM" && Number.parseInt(closeHour) !== 12) {
    closeTime += 12 * 60
  }
  if (closePeriod.toUpperCase() === "AM" && Number.parseInt(closeHour) === 12) {
    closeTime = Number.parseInt(closeMin)
  }

  // Handle overnight hours (e.g., 10 PM - 2 AM)
  if (closeTime < openTime) {
    return currentTime >= openTime || currentTime <= closeTime
  }

  return currentTime >= openTime && currentTime <= closeTime
}

/**
 * Get price level symbol representation
 */
export function getPriceLevelSymbol(priceLevel: number): string {
  return "$".repeat(Math.max(1, Math.min(4, priceLevel)))
}

/**
 * Filter cafés based on search criteria
 */
export function filterCafes(cafes: Cafe[], filters: SearchFilters): Cafe[] {
  return cafes.filter((cafe) => {
    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase()
      const searchableText = [cafe.name, cafe.description, cafe.address, ...cafe.tags, ...cafe.amenities]
        .join(" ")
        .toLowerCase()

      if (!searchableText.includes(query)) {
        return false
      }
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) =>
        cafe.amenities.some((cafeAmenity) => cafeAmenity.toLowerCase().includes(amenity.toLowerCase())),
      )
      if (!hasAllAmenities) {
        return false
      }
    }

    // Price level filter
    if (filters.priceLevel && filters.priceLevel.length > 0) {
      if (!filters.priceLevel.includes(cafe.priceLevel)) {
        return false
      }
    }

    // Rating filter
    if (filters.rating && cafe.rating < filters.rating) {
      return false
    }

    // Noise level filter
    if (filters.noiseLevel && filters.noiseLevel.length > 0) {
      if (!filters.noiseLevel.includes(cafe.noiseLevel)) {
        return false
      }
    }

    // Study friendly filter
    if (filters.studyFriendly && !cafe.studyFriendly) {
      return false
    }

    return true
  })
}

/**
 * Sort cafés by various criteria
 */
export function sortCafes(cafes: Cafe[], sortBy: "rating" | "distance" | "name" | "priceLevel"): Cafe[] {
  return [...cafes].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      case "priceLevel":
        return a.priceLevel - b.priceLevel
      case "distance":
        // Assumes distance property exists on cafes
        return ((a as any).distance || 0) - ((b as any).distance || 0)
      default:
        return 0
    }
  })
}

/**
 * Get business status text
 */
export function getBusinessStatus(hours: Record<string, string>): { status: string; nextChange?: string } {
  const isOpen = isOpenNow(hours)
  const now = new Date()
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() as keyof typeof hours

  if (isOpen) {
    return { status: "Open now" }
  } else {
    // Find next opening time
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const currentDayIndex = now.getDay()

    for (let i = 0; i < 7; i++) {
      const dayIndex = (currentDayIndex + i) % 7
      const day = days[dayIndex] as keyof typeof hours
      const dayHours = hours[day]

      if (dayHours && dayHours !== "Closed") {
        if (i === 0) {
          return { status: "Closed", nextChange: "Opens later today" }
        } else if (i === 1) {
          return { status: "Closed", nextChange: "Opens tomorrow" }
        } else {
          const dayName = day.charAt(0).toUpperCase() + day.slice(1)
          return { status: "Closed", nextChange: `Opens ${dayName}` }
        }
      }
    }

    return { status: "Closed" }
  }
}
