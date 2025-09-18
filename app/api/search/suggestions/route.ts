import { type NextRequest, NextResponse } from "next/server"
import { mockCafes } from "@/lib/data/cafes"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const suggestions = new Set<string>()

    // Search in café names
    mockCafes.forEach((cafe) => {
      if (cafe.name.toLowerCase().includes(query)) {
        suggestions.add(cafe.name)
      }

      // Search in tags
      cafe.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(query)) {
          suggestions.add(tag)
        }
      })

      // Search in amenities
      cafe.amenities.forEach((amenity) => {
        if (amenity.toLowerCase().includes(query)) {
          suggestions.add(amenity)
        }
      })
    })

    // Convert to array and limit results
    const suggestionArray = Array.from(suggestions).slice(0, 8)

    return NextResponse.json({ suggestions: suggestionArray })
  } catch (error) {
    console.error("Error fetching suggestions:", error)
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 })
  }
}
