import { type NextRequest, NextResponse } from "next/server"
import { mockCafes } from "@/lib/data/cafes"
import { filterCafes, calculateDistance, isOpenNow } from "@/lib/utils/cafe-utils"
import { GooglePlacesService } from "@/lib/services/google-places"
import type { SearchFilters } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    // Parse search filters from query parameters
    const filters: SearchFilters = {
      query: searchParams.get("query") || undefined,
      amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || undefined,
      priceLevel: searchParams.get("priceLevel")?.split(",").map(Number).filter(Boolean) || undefined,
      rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined,
      noiseLevel: searchParams.get("noiseLevel")?.split(",").filter(Boolean) || undefined,
      studyFriendly: searchParams.get("studyFriendly") === "true" ? true : undefined,
      openNow: searchParams.get("openNow") === "true" ? true : undefined,
      distance: searchParams.get("distance") ? Number(searchParams.get("distance")) : undefined,
      location:
        searchParams.get("lat") && searchParams.get("lng")
          ? {
              lat: Number(searchParams.get("lat")),
              lng: Number(searchParams.get("lng")),
            }
          : undefined,
    }

    let cafes = []

    // Use Google Places API if API key is available and we have a location
    if (apiKey && apiKey !== "YOUR_API_KEY_HERE" && filters.location) {
      try {
        const placesService = new GooglePlacesService(apiKey)
        
        // Search for cafes near the user's location
        const places = await placesService.searchNearby(
          filters.location,
          (filters.distance || 10) * 1000, // Convert miles to meters
          'cafe',
          filters.query
        )

        // Convert Google Places to our Cafe format
        cafes = places.map(place => placesService.convertToCafe(place, filters.location))
        
        console.log(`[API] Found ${cafes.length} cafes from Google Places API`)
      } catch (error) {
        console.error("Error fetching from Google Places API:", error)
        // Fall back to mock data if Google Places fails
        cafes = mockCafes
      }
    } else {
      // Use mock data if no API key or location
      console.log("[API] Using mock data - no API key or location provided")
      cafes = mockCafes
    }

    // Apply additional filters
    let filteredCafes = filterCafes(cafes, filters)

    // Filter by open now if requested
    if (filters.openNow) {
      filteredCafes = filteredCafes.filter((cafe) => isOpenNow(cafe.hours))
    }

    // Filter by distance if location and distance are provided
    if (filters.location && filters.distance) {
      filteredCafes = filteredCafes.filter((cafe) => {
        const distance = calculateDistance(filters.location!.lat, filters.location!.lng, cafe.latitude, cafe.longitude)
        return distance <= filters.distance!
      })
    }

    // Add distance to each café if location is provided
    if (filters.location) {
      filteredCafes = filteredCafes.map((cafe) => ({
        ...cafe,
        distance: calculateDistance(filters.location!.lat, filters.location!.lng, cafe.latitude, cafe.longitude),
      }))
    }

    // Sort by distance if location is provided, otherwise by rating
    filteredCafes.sort((a, b) => {
      if (filters.location && "distance" in a && "distance" in b) {
        return (a as any).distance - (b as any).distance
      }
      return b.rating - a.rating
    })

    return NextResponse.json({
      cafes: filteredCafes,
      total: filteredCafes.length,
      filters: filters,
      source: apiKey && apiKey !== "YOUR_API_KEY_HERE" && filters.location ? "google_places" : "mock_data"
    })
  } catch (error) {
    console.error("Error fetching cafes:", error)
    return NextResponse.json({ error: "Failed to fetch cafes" }, { status: 500 })
  }
}
