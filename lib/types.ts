export interface Cafe {
  id: string
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  phone?: string
  website?: string
  rating: number
  reviewCount: number
  priceLevel: number
  hours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  wifi: {
    available: boolean
    speed: string
    password?: string
  }
  powerOutlets: boolean
  noiseLevel: "quiet" | "moderate" | "lively"
  studyFriendly: boolean
  amenities: string[]
  tags: string[]
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  cafeId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  helpful: number
}

export interface UserLocation {
  lat: number
  lng: number
}

export interface MapMarker {
  position: {
    lat: number
    lng: number
  }
  title: string
  cafeId: string
}
