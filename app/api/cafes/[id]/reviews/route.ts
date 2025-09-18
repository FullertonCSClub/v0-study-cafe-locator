import { type NextRequest, NextResponse } from "next/server"
import { mockReviews } from "@/lib/data/cafes"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const sortBy = searchParams.get("sortBy") || "newest" // newest, oldest, rating, helpful

    const reviews = mockReviews.filter((review) => review.cafeId === id)

    // Sort reviews
    reviews.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "rating":
          return b.rating - a.rating
        case "helpful":
          return b.helpful - a.helpful
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    // Paginate
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedReviews = reviews.slice(startIndex, endIndex)

    return NextResponse.json({
      reviews: paginatedReviews,
      pagination: {
        page,
        limit,
        total: reviews.length,
        totalPages: Math.ceil(reviews.length / limit),
        hasNext: endIndex < reviews.length,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // Validate required fields
    const { userName, rating, comment, studyRating, wifiRating, noiseRating } = body

    if (!userName || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields: userName, rating, comment" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Create new review
    const newReview = {
      id: Date.now().toString(),
      cafeId: id,
      userName,
      userAvatar: "/placeholder.svg?height=40&width=40",
      rating,
      comment,
      studyRating,
      wifiRating,
      noiseRating,
      createdAt: new Date().toISOString(),
      helpful: 0,
    }

    // In a real app, this would be saved to a database
    mockReviews.push(newReview)

    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
