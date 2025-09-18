"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CafeImageGallery } from "./cafe-image-gallery"
import { CafeInfo } from "./cafe-info"
import { CafeReviews } from "./cafe-reviews"
import { CafeMap } from "./cafe-map"
import { ReviewForm } from "./review-form"
import type { Cafe, Review } from "@/lib/types"
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  Wifi,
  Zap,
  Users,
  BookOpen,
  Share,
  Heart,
  LucideCaptions as Directions,
} from "lucide-react"
import Link from "next/link"
import { isOpenNow, getPriceLevelSymbol } from "@/lib/utils/cafe-utils"

interface CafeDetailViewProps {
  cafe: Cafe
  reviews: Review[]
}

export function CafeDetailView({ cafe, reviews }: CafeDetailViewProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const isOpen = isOpenNow(cafe.hours)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: cafe.name,
          text: `Check out ${cafe.name} - a great study café!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${cafe.latitude},${cafe.longitude}`
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Map
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant={isFavorited ? "default" : "outline"}
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                {isFavorited ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <div className="space-y-4">
              <CafeImageGallery images={cafe.images} cafeName={cafe.name} />

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-balance">{cafe.name}</h1>
                    <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{cafe.rating}</span>
                        <span>({cafe.reviewCount} reviews)</span>
                      </div>
                      <span>{getPriceLevelSymbol(cafe.priceLevel)}</span>
                      <Badge variant={isOpen ? "default" : "secondary"}>{isOpen ? "Open Now" : "Closed"}</Badge>
                    </div>
                  </div>

                  {cafe.studyFriendly && (
                    <Badge variant="outline" className="shrink-0">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Study Friendly
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground leading-relaxed">{cafe.description}</p>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleDirections} className="flex-1 sm:flex-none">
                    <Directions className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  {cafe.phone && (
                    <Button variant="outline" asChild className="flex-1 sm:flex-none bg-transparent">
                      <a href={`tel:${cafe.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </Button>
                  )}
                  {cafe.website && (
                    <Button variant="outline" asChild className="flex-1 sm:flex-none bg-transparent">
                      <a href={cafe.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <CafeInfo cafe={cafe} />
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Reviews & Ratings</h3>
                  <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
                </div>

                {showReviewForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ReviewForm cafeId={cafe.id} onSubmit={() => setShowReviewForm(false)} />
                    </CardContent>
                  </Card>
                )}

                <CafeReviews reviews={reviews} />
              </TabsContent>

              <TabsContent value="photos" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {cafe.images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${cafe.name} photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{cafe.address}</p>
                <CafeMap cafe={cafe} />
                <Button variant="outline" onClick={handleDirections} className="w-full bg-transparent">
                  <Directions className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Hours Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(cafe.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize font-medium">{day}</span>
                      <span className={hours === "24 Hours" ? "text-primary font-medium" : ""}>{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amenities Card */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {cafe.wifi.available && (
                    <div className="flex items-center gap-2 text-sm">
                      <Wifi className="h-4 w-4 text-primary" />
                      <span>Free WiFi</span>
                    </div>
                  )}
                  {cafe.powerOutlets && (
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>Power Outlets</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="capitalize">{cafe.noiseLevel} Noise</span>
                  </div>
                  {cafe.studyFriendly && (
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>Study Friendly</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  {cafe.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* WiFi Info Card */}
            {cafe.wifi.available && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    WiFi Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cafe.wifi.speed && (
                    <div className="flex justify-between text-sm">
                      <span>Speed</span>
                      <span className="font-medium">{cafe.wifi.speed}</span>
                    </div>
                  )}
                  {cafe.wifi.password && (
                    <div className="flex justify-between text-sm">
                      <span>Password</span>
                      <code className="bg-muted px-2 py-1 rounded text-xs">{cafe.wifi.password}</code>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cafe.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
