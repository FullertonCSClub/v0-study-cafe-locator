"use client"

import { ExternalLink, Key } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getGoogleMapsApiKey } from "@/lib/actions/maps"

export function SetupNotice() {
  const [hasGoogleMapsKey, setHasGoogleMapsKey] = useState<boolean | null>(null)

  useEffect(() => {
    getGoogleMapsApiKey().then((apiKey) => {
      setHasGoogleMapsKey(!!apiKey && apiKey !== "YOUR_API_KEY")
    })
  }, [])

  if (hasGoogleMapsKey === null) {
    return null // Loading state
  }

  if (hasGoogleMapsKey) return null

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-900">Setup Required</CardTitle>
        </div>
        <CardDescription className="text-amber-700">
          To enable interactive maps, you need to configure your Google Maps API key.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-2">Steps to enable Google Maps:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Get a Google Maps API key from the Google Cloud Console</li>
            <li>
              Add it as <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in your
              environment variables
            </li>
            <li>Refresh the page to see interactive maps</li>
          </ol>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-amber-300 text-amber-700 hover:bg-amber-100 bg-transparent"
          onClick={() =>
            window.open("https://developers.google.com/maps/documentation/javascript/get-api-key", "_blank")
          }
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Get API Key
        </Button>
      </CardContent>
    </Card>
  )
}
