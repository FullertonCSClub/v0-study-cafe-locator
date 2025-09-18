"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Cafe } from "@/lib/types"

interface CafeFormProps {
  cafe?: Cafe | null
  onSave: (cafe: Partial<Cafe>) => void
  onCancel: () => void
}

export function CafeForm({ cafe, onSave, onCancel }: CafeFormProps) {
  const [formData, setFormData] = useState({
    name: cafe?.name || "",
    address: cafe?.address || "",
    latitude: cafe?.latitude || 0,
    longitude: cafe?.longitude || 0,
    phone: cafe?.phone || "",
    website: cafe?.website || "",
    description: cafe?.description || "",
    priceLevel: cafe?.priceLevel || 2,
    noiseLevel: cafe?.noiseLevel || "moderate",
    studyFriendly: cafe?.studyFriendly || true,
    powerOutlets: cafe?.powerOutlets || true,
    wifi: {
      available: cafe?.wifi?.available || true,
      speed: cafe?.wifi?.speed || "",
      password: cafe?.wifi?.password || "",
    },
    hours: cafe?.hours || {
      monday: "7:00 AM - 9:00 PM",
      tuesday: "7:00 AM - 9:00 PM",
      wednesday: "7:00 AM - 9:00 PM",
      thursday: "7:00 AM - 9:00 PM",
      friday: "7:00 AM - 10:00 PM",
      saturday: "8:00 AM - 10:00 PM",
      sunday: "8:00 AM - 8:00 PM",
    },
    amenities: cafe?.amenities || [],
    tags: cafe?.tags || [],
    images: cafe?.images || [],
  })

  const amenityOptions = [
    "Free WiFi",
    "Power Outlets",
    "Quiet Zone",
    "Study Rooms",
    "Group Tables",
    "Outdoor Seating",
    "24/7 Hours",
    "Printing Services",
    "Meeting Rooms",
    "Whiteboards",
    "Bookstore",
    "Healthy Snacks",
    "Noise-Canceling Headphones Available",
    "Individual Tables",
    "Presentation Screen",
    "Study Room Rentals",
    "Security",
    "Energy Drinks",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, amenity] : prev.amenities.filter((a) => a !== amenity),
    }))
  }

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, tags }))
  }

  const handleImagesChange = (value: string) => {
    const images = value
      .split(",")
      .map((img) => img.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, images }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Café Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, latitude: Number.parseFloat(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData((prev) => ({ ...prev, longitude: Number.parseFloat(e.target.value) }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Study Environment */}
      <Card>
        <CardHeader>
          <CardTitle>Study Environment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceLevel">Price Level</Label>
              <Select
                value={formData.priceLevel.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, priceLevel: Number.parseInt(value) as 1 | 2 | 3 | 4 }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">$ - Very Affordable</SelectItem>
                  <SelectItem value="2">$$ - Moderate</SelectItem>
                  <SelectItem value="3">$$$ - Higher-end</SelectItem>
                  <SelectItem value="4">$$$$ - Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="noiseLevel">Noise Level</Label>
              <Select
                value={formData.noiseLevel}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, noiseLevel: value as "quiet" | "moderate" | "loud" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiet">Quiet</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="loud">Loud</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="studyFriendly">Study Friendly</Label>
                <Switch
                  id="studyFriendly"
                  checked={formData.studyFriendly}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, studyFriendly: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="powerOutlets">Power Outlets</Label>
                <Switch
                  id="powerOutlets"
                  checked={formData.powerOutlets}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, powerOutlets: checked }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WiFi Information */}
      <Card>
        <CardHeader>
          <CardTitle>WiFi Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="wifiAvailable">WiFi Available</Label>
            <Switch
              id="wifiAvailable"
              checked={formData.wifi.available}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, wifi: { ...prev.wifi, available: checked } }))
              }
            />
          </div>

          {formData.wifi.available && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wifiSpeed">WiFi Speed</Label>
                <Input
                  id="wifiSpeed"
                  value={formData.wifi.speed}
                  onChange={(e) => setFormData((prev) => ({ ...prev, wifi: { ...prev.wifi, speed: e.target.value } }))}
                  placeholder="e.g., 100+ Mbps"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wifiPassword">WiFi Password</Label>
                <Input
                  id="wifiPassword"
                  value={formData.wifi.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, wifi: { ...prev.wifi, password: e.target.value } }))
                  }
                  placeholder="Leave empty if no password"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(formData.hours).map(([day, hours]) => (
            <div key={day} className="flex items-center gap-4">
              <Label className="w-20 capitalize">{day}</Label>
              <Input
                value={hours}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hours: { ...prev.hours, [day]: e.target.value },
                  }))
                }
                placeholder="e.g., 7:00 AM - 9:00 PM or Closed"
                className="flex-1"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {amenityOptions.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={formData.amenities.includes(amenity)}
                  onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                />
                <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags and Images */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags.join(", ")}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="e.g., Near UCI, Quiet, Fast WiFi"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Image URLs (comma-separated)</Label>
            <Textarea
              id="images"
              value={formData.images.join(", ")}
              onChange={(e) => handleImagesChange(e.target.value)}
              placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-2">
        <Button type="submit">Save Café</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
