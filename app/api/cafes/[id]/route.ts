import { type NextRequest, NextResponse } from "next/server"
import { mockCafes, mockReviews } from "@/lib/data/cafes"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const cafe = mockCafes.find((c) => c.id === id)

    if (!cafe) {
      return NextResponse.json({ error: "Café not found" }, { status: 404 })
    }

    // Get reviews for this café
    const reviews = mockReviews.filter((review) => review.cafeId === id)

    return NextResponse.json({
      cafe,
      reviews,
      reviewCount: reviews.length,
    })
  } catch (error) {
    console.error("Error fetching cafe:", error)
    return NextResponse.json({ error: "Failed to fetch cafe details" }, { status: 500 })
  }
}
