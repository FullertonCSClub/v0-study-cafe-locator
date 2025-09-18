"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Cafe } from "@/lib/types"
import { Wifi, Zap, Volume2, DollarSign, Star } from "lucide-react"

interface CafeInfoProps {
  cafe: Cafe
}

export function CafeInfo({ cafe }: CafeInfoProps) {
  const getNoiseIcon = (level: string) => {
    switch (level) {
      case "quiet":
        return <Volume2 className="h-4 w-4 text-green-500" />
      case "moderate":
        return <Volume2 className="h-4 w-4 text-yellow-500" />
      case "loud":
        return <Volume2 className="h-4 w-4 text-red-500" />
      default:
        return <Volume2 className="h-4 w-4" />
    }
  }

  const getNoiseDescription = (level: string) => {
    switch (level) {
      case "quiet":
        return "Perfect for focused study sessions and reading"
      case "moderate":
        return "Good for casual studying and light conversation"
      case "loud":
        return "Better for group work and collaborative projects"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Study Environment */}
      <Card>
        <CardHeader>
          <CardTitle>Study Environment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Study Friendliness</span>
                <Badge variant={cafe.studyFriendly ? "default" : "secondary"}>
                  {cafe.studyFriendly ? "Excellent" : "Limited"}
                </Badge>
              </div>
              <Progress value={cafe.studyFriendly ? 90 : 30} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Noise Level</span>
                <div className="flex items-center gap-1">
                  {getNoiseIcon(cafe.noiseLevel)}
                  <span className="text-sm capitalize">{cafe.noiseLevel}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{getNoiseDescription(cafe.noiseLevel)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cafe.wifi.available && (
            <div className="flex items-start gap-3">
              <Wifi className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">WiFi</span>
                  {cafe.wifi.speed && <Badge variant="outline">{cafe.wifi.speed}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">Free high-speed internet available</p>
                {cafe.wifi.password && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Password: <code className="bg-muted px-1 rounded">{cafe.wifi.password}</code>
                  </p>
                )}
              </div>
            </div>
          )}

          {cafe.powerOutlets && (
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <span className="font-medium">Power Outlets</span>
                <p className="text-sm text-muted-foreground">Plenty of outlets available for laptops and devices</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">Price Level</span>
                <Badge variant="outline">{"$".repeat(cafe.priceLevel)}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {cafe.priceLevel === 1 && "Very affordable, great for students"}
                {cafe.priceLevel === 2 && "Moderate pricing, good value"}
                {cafe.priceLevel === 3 && "Higher-end, premium experience"}
                {cafe.priceLevel === 4 && "Luxury pricing, exceptional quality"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratings Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Ratings Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">{cafe.rating}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Based on {cafe.reviewCount} reviews</p>
            </div>
          </div>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              // Mock distribution for demo
              const percentage = stars === 5 ? 60 : stars === 4 ? 25 : stars === 3 ? 10 : stars === 2 ? 3 : 2
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm w-8">{stars}★</span>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-10">{percentage}%</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Seating Capacity:</span>
              <span className="ml-2 text-muted-foreground">
                {cafe.noiseLevel === "quiet"
                  ? "50-80 seats"
                  : cafe.noiseLevel === "moderate"
                    ? "80-120 seats"
                    : "120+ seats"}
              </span>
            </div>
            <div>
              <span className="font-medium">Best Study Times:</span>
              <span className="ml-2 text-muted-foreground">
                {cafe.noiseLevel === "quiet" ? "All day" : "Mornings & evenings"}
              </span>
            </div>
            <div>
              <span className="font-medium">Parking:</span>
              <span className="ml-2 text-muted-foreground">Street parking available</span>
            </div>
            <div>
              <span className="font-medium">Accessibility:</span>
              <span className="ml-2 text-muted-foreground">Wheelchair accessible</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
