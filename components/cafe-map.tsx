"use client"

import { useEffect, useRef, useState } from "react"
import type { Cafe } from "@/lib/types"
import { MapPin } from "lucide-react"

interface CafeMapProps {
  cafe: Cafe
}

export function CafeMap({ cafe }: CafeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    if (!mapRef.current) return

    const initMap = () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        if (!apiKey || apiKey === "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY") {
          console.log("[v0] No Google Maps API key, using fallback for cafe map")
          setUseFallback(true)
          return
        }

        if (typeof window.google === "undefined" || !window.google.maps) {
          throw new Error("Google Maps API not loaded")
        }

        const map = new window.google.maps.Map(mapRef.current!, {
          center: { lat: cafe.latitude, lng: cafe.longitude },
          zoom: 15,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        })

        new window.google.maps.Marker({
          position: { lat: cafe.latitude, lng: cafe.longitude },
          map: map,
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
      } catch (error) {
        console.error("Error initializing cafe map:", error)
        setUseFallback(true)
      }
    }

    // Check if Google Maps is loaded
    if (typeof window.google !== "undefined" && window.google.maps) {
      initMap()
    } else {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        setUseFallback(true)
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.onload = initMap
      script.onerror = () => setUseFallback(true)
      document.head.appendChild(script)
    }
  }, [cafe])

  if (useFallback) {
    return (
      <div className="w-full h-48 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fillRule=%22evenodd%22%3E%3Cg fill=%22%23e0e7ff%22 fillOpacity=%220.4%22%3E%3Cpath d=%22M20 20h20v20H20V20zm0-20h20v20H20V0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

        {/* Cafe marker */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-full">
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

        {/* Fallback notice */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {cafe.name}
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-48 rounded-lg bg-muted" />
}
