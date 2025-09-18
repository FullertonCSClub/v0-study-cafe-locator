"use client"

import type { Cafe } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Wifi, Zap, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { isOpenNow, getPriceLevelSymbol } from "@/lib/utils/cafe-utils"
import Link from "next/link"

interface CafeCardProps {
  cafe: Cafe
  isSelected?: boolean
  onClick?: () => void
  distance?: number
  showFullDetails?: boolean
}

export function CafeCard({ cafe, isSelected, onClick, distance, showFullDetails = false }: CafeCardProps) {
  const isOpen = isOpenNow(cafe.hours)

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-md border-l-4",
        isSelected ? "border-l-primary bg-primary/5" : "border-l-transparent hover:border-l-primary/50",
      )}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base truncate">{cafe.name}</h3>
              <Badge variant={isOpen ? "default" : "secondary"} className="text-xs shrink-0">
                {isOpen ? "Open" : "Closed"}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{cafe.rating}</span>
                <span>({cafe.reviewCount})</span>
              </div>

              <span>{getPriceLevelSymbol(cafe.priceLevel)}</span>

              {distance && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{distance.toFixed(1)} mi</span>
                </div>
              )}
            </div>
          </div>

          {cafe.studyFriendly && (
            <Badge variant="outline" className="text-xs shrink-0">
              📚 Study Friendly
            </Badge>
          )}
        </div>

        {/* Address */}
        <p className="text-sm text-muted-foreground line-clamp-1">{cafe.address}</p>

        {/* Description */}
        {showFullDetails && <p className="text-sm text-muted-foreground line-clamp-2">{cafe.description}</p>}

        {/* Amenities */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {cafe.wifi.available && (
            <div className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              <span>WiFi</span>
            </div>
          )}

          {cafe.powerOutlets && (
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>Power</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span className="capitalize">{cafe.noiseLevel}</span>
          </div>

          {cafe.hours.monday === "24 Hours" && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>24/7</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {cafe.tags.slice(0, showFullDetails ? cafe.tags.length : 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {!showFullDetails && cafe.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{cafe.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Action */}
        {showFullDetails && (
          <div className="pt-2">
            <Link
              href={`/cafe/${cafe.id}`}
              className="text-primary hover:underline text-sm font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              View Details →
            </Link>
          </div>
        )}
      </div>
    </Card>
  )
}
