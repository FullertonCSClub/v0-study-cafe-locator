"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Review } from "@/lib/types"
import { Star, ThumbsUp, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CafeReviewsProps {
  reviews: Review[]
}

export function CafeReviews({ reviews }: CafeReviewsProps) {
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating" | "helpful">("newest")

  const sortedReviews = [...reviews].sort((a, b) => {
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

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet. Be the first to review this café!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <div className="flex gap-1">
          {[
            { value: "newest", label: "Newest" },
            { value: "helpful", label: "Most Helpful" },
            { value: "rating", label: "Highest Rated" },
            { value: "oldest", label: "Oldest" },
          ].map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy(option.value as any)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                      <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Specific Ratings */}
                  <div className="flex gap-2">
                    {review.studyRating && (
                      <Badge variant="outline" className="text-xs">
                        Study: {review.studyRating}★
                      </Badge>
                    )}
                    {review.wifiRating && (
                      <Badge variant="outline" className="text-xs">
                        WiFi: {review.wifiRating}★
                      </Badge>
                    )}
                    {review.noiseRating && (
                      <Badge variant="outline" className="text-xs">
                        Noise: {review.noiseRating}★
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <p className="text-sm leading-relaxed">{review.comment}</p>

                {/* Review Actions */}
                <div className="flex items-center justify-between pt-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
