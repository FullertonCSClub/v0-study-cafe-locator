"use client"

import { useRef, useState, useEffect } from "react"
import type { Cafe } from "@/lib/types"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { MapPin, AlertCircle } from "lucide-react"
import { getGoogleMapsApiKey } from "@/lib/actions/maps"

interface MapViewProps {
  cafes: Cafe[]
  selectedCafeId: string | null
  onCafeSelect: (cafeId: string) => void
  userLocation: { lat: number; lng: number } | null
  isLoading: boolean
}

export function MapView({ cafes, selectedCafeId, onCafeSelect, userLocation, isLoading }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any | null>(null)
  const markersRef = useRef<any[]>([])
  const userMarkerRef = useRef<any | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)

  useEffect(() => {
    getGoogleMapsApiKey().then(setApiKey)
  }, [])

  const FallbackMap = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fillRule=%22evenodd%22%3E%3Cg fill=%22%23e0e7ff%22 fillOpacity=%220.3%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      {userLocation && (
        <div
          className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: "50%",
            top: "50%",
          }}
        />
      )}
      {cafes.map((cafe, index) => {
        const offsetX = (cafe.longitude - (userLocation?.lng || -117.8)) * 1000
        const offsetY = ((userLocation?.lat || 33.7) - cafe.latitude) * 1000
        const left = Math.max(10, Math.min(90, 50 + offsetX))
        const top = Math.max(10, Math.min(90, 50 + offsetY))

        return (
          <div
            key={cafe.id}
            className={`absolute w-8 h-8 cursor-pointer transform -translate-x-1/2 -translate-y-full z-20 transition-all hover:scale-110 ${
              selectedCafeId === cafe.id ? "scale-125" : ""
            }`}
            style={{ left: `${left}%`, top: `${top}%` }}
            onClick={() => onCafeSelect(cafe.id)}
            title={cafe.name}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 2C11.6 2 8 5.6 8 10c0 6 8 18 8 18s8-12 8-18c0-4.4-3.6-8-8-8z"
                fill="#d97706"
                stroke="white"
                strokeWidth="2"
              />
              <circle cx="16" cy="10" r="3" fill="white" />
            </svg>
          </div>
        )
      })}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-muted-foreground">
        <MapPin className="h-3 w-3 inline mr-1" />
        Interactive map (demo mode)
      </div>
    </div>
  )

  useEffect(() => {
    console.log("[v0] MapView useEffect triggered, userLocation:", userLocation)
    if (!mapRef.current || !apiKey) {
      console.log("[v0] No mapRef.current or API key not loaded yet")
      return
    }

    const initMap = () => {
      try {
        console.log("[v0] Initializing Google Maps...")
        setIsMapLoading(true)
        setMapError(null)

        console.log("[v0] Using API key:", apiKey ? apiKey.substring(0, 10) + "..." : "not found")

        if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
          console.log(
            "[v0] Google Maps API key not configured. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.",
          )
          setUseFallback(true)
          setIsMapLoading(false)
          return
        }

        if (typeof window.google === "undefined" || !window.google.maps) {
          console.log("[v0] Google Maps API not loaded yet")
          throw new Error("Google Maps API not loaded")
        }

        console.log("[v0] Creating Google Maps instance...")
        const mapCenter = { lat: 33.7175, lng: -117.8311 } // Always use a default center
        console.log("[v0] Map center:", mapCenter)

        const map = new window.google.maps.Map(mapRef.current!, {
          center: mapCenter,
          zoom: 12,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        })

        console.log("[v0] Google Maps instance created successfully")
        mapInstanceRef.current = map

        if (userLocation) {
          console.log("[v0] Adding user location marker")
          userMarkerRef.current = new window.google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Your Location",
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12),
            },
          })
        }

        setIsMapLoading(false)
        console.log("[v0] Map initialization complete")
      } catch (error) {
        console.error("[v0] Error initializing map:", error)
        console.log("[v0] Falling back to demo map")
        setUseFallback(true)
        setIsMapLoading(false)
      }
    }

    if (typeof window.google !== "undefined" && window.google.maps) {
      console.log("[v0] Google Maps API already loaded")
      initMap()
    } else {
      console.log("[v0] Loading Google Maps API...")
      if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        console.log("[v0] No Google Maps API key found, using fallback")
        setUseFallback(true)
        setIsMapLoading(false)
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.onload = () => {
        console.log("[v0] Google Maps API loaded successfully")
        initMap()
      }
      script.onerror = (error) => {
        console.error("[v0] Failed to load Google Maps API:", error)
        console.log("[v0] Using fallback map")
        setUseFallback(true)
        setIsMapLoading(false)
      }
      document.head.appendChild(script)
    }
  }, [apiKey]) // Depend on apiKey instead of empty array

  useEffect(() => {
    if (!mapInstanceRef.current || mapError) return

    try {
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []

      cafes.forEach((cafe) => {
        const marker = new window.google.maps.Marker({
          position: { lat: cafe.latitude, lng: cafe.longitude },
          map: mapInstanceRef.current!,
          title: cafe.name,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2C11.6 2 8 5.6 8 10c0 6 8 18 8 18s8-12 8-18c0-4.4-3.6-8-8-8z" fill="#d97706" stroke="white" strokeWidth="2"/>
                <circle cx="16" cy="10" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32),
          },
        })

        marker.addListener("click", () => {
          onCafeSelect(cafe.id)
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2 max-w-xs">
              <h3 class="font-semibold text-sm">${cafe.name}</h3>
              <p class="text-xs text-gray-600 mt-1">${cafe.address}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs">⭐ ${cafe.rating}</span>
                <span class="text-xs">${"$".repeat(cafe.priceLevel)}</span>
                <span class="text-xs ${cafe.studyFriendly ? "text-green-600" : "text-gray-400"}">
                  📚 Study Friendly
                </span>
              </div>
            </div>
          `,
        })

        marker.addListener("click", () => {
          markersRef.current.forEach((m) => {
            if ((m as any).infoWindow) {
              ;(m as any).infoWindow.close()
            }
          })
          infoWindow.open(mapInstanceRef.current!, marker)
        })
        ;(marker as any).infoWindow = infoWindow
        markersRef.current.push(marker)
      })
    } catch (error) {
      console.error("Error updating markers:", error)
      setMapError("Failed to update map markers")
    }
  }, [cafes, onCafeSelect, mapError])

  useEffect(() => {
    if (!selectedCafeId || mapError) return

    const selectedCafe = cafes.find((cafe) => cafe.id === selectedCafeId)
    if (!selectedCafe || !mapInstanceRef.current) return

    try {
      mapInstanceRef.current.panTo({ lat: selectedCafe.latitude, lng: selectedCafe.longitude })

      const selectedMarker = markersRef.current.find((marker, index) => cafes[index]?.id === selectedCafeId)

      if (selectedMarker && (selectedMarker as any).infoWindow) {
        ;(selectedMarker as any).infoWindow.open(mapInstanceRef.current, selectedMarker)
      }
    } catch (error) {
      console.error("Error highlighting selected cafe:", error)
    }
  }, [selectedCafeId, cafes, mapError])

  const handleRetry = () => {
    setMapError(null)
    window.location.reload()
  }

  if (isLoading || isMapLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <div className="flex items-center gap-2 text-muted-foreground">
          <LoadingSpinner />
          Loading map...
        </div>
      </div>
    )
  }

  if (useFallback) {
    return (
      <div className="relative h-full">
        <FallbackMap />
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <EmptyState
          icon={<AlertCircle className="h-12 w-12" />}
          title="Map Error"
          description={mapError}
          action={{
            label: "Retry",
            onClick: handleRetry,
          }}
        />
      </div>
    )
  }

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="w-full h-full" />
      {!userLocation && (
        <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg text-sm">
          <MapPin className="h-4 w-4 inline mr-1" />
          Enable location for better results
        </div>
      )}
    </div>
  )
}
