interface GooglePlace {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  rating?: number
  user_ratings_total?: number
  price_level?: number
  opening_hours?: {
    open_now: boolean
    weekday_text: string[]
  }
  types: string[]
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
}

interface GooglePlacesResponse {
  results: GooglePlace[]
  status: string
  next_page_token?: string
}

export class GooglePlacesService {
  private apiKey: string
  private baseUrl = 'https://maps.googleapis.com/maps/api/place'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchNearby(
    location: { lat: number; lng: number },
    radius: number = 5000,
    type: string = 'cafe',
    keyword?: string
  ): Promise<GooglePlace[]> {
    const url = `${this.baseUrl}/nearbysearch/json`
    const params = new URLSearchParams({
      location: `${location.lat},${location.lng}`,
      radius: radius.toString(),
      type,
      key: this.apiKey,
    })

    if (keyword) {
      params.set('keyword', keyword)
    }

    try {
      const response = await fetch(`${url}?${params}`)
      const data: GooglePlacesResponse = await response.json()

      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`)
      }

      return data.results
    } catch (error) {
      console.error('Error fetching nearby places:', error)
      throw error
    }
  }

  async searchText(
    query: string,
    location?: { lat: number; lng: number },
    radius?: number
  ): Promise<GooglePlace[]> {
    const url = `${this.baseUrl}/textsearch/json`
    const params = new URLSearchParams({
      query: `${query} cafe coffee shop`,
      key: this.apiKey,
    })

    if (location) {
      params.set('location', `${location.lat},${location.lng}`)
      if (radius) {
        params.set('radius', radius.toString())
      }
    }

    try {
      const response = await fetch(`${url}?${params}`)
      const data: GooglePlacesResponse = await response.json()

      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`)
      }

      return data.results
    } catch (error) {
      console.error('Error searching places:', error)
      throw error
    }
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    const url = `${this.baseUrl}/details/json`
    const params = new URLSearchParams({
      place_id: placeId,
      fields: 'name,formatted_address,geometry,rating,user_ratings_total,price_level,opening_hours,types,photos,website,formatted_phone_number',
      key: this.apiKey,
    })

    try {
      const response = await fetch(`${url}?${params}`)
      const data = await response.json()

      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`)
      }

      return data.result
    } catch (error) {
      console.error('Error fetching place details:', error)
      throw error
    }
  }

  // Convert Google Place to our Cafe format
  convertToCafe(place: GooglePlace, userLocation?: { lat: number; lng: number }): any {
    const distance = userLocation 
      ? this.calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          place.geometry.location.lat, 
          place.geometry.location.lng
        )
      : undefined

    return {
      id: place.place_id,
      name: place.name,
      description: `A ${place.types.includes('cafe') ? 'cafe' : 'coffee shop'} located at ${place.formatted_address}`,
      address: place.formatted_address,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      rating: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      priceLevel: place.price_level || 1,
      hours: this.parseOpeningHours(place.opening_hours?.weekday_text || []),
      wifi: {
        available: true, // Assume available for cafes
        speed: "High-speed",
      },
      powerOutlets: true, // Assume available for cafes
      noiseLevel: this.estimateNoiseLevel(place.rating || 0, place.user_ratings_total || 0),
      studyFriendly: this.isStudyFriendly(place.types, place.rating || 0),
      amenities: this.generateAmenities(place.types),
      tags: this.generateTags(place.types),
      images: place.photos?.slice(0, 3).map(photo => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.apiKey}`
      ) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      distance,
    }
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private parseOpeningHours(weekdayText: string[]): any {
    const hours: any = {}
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    
    weekdayText.forEach((dayText, index) => {
      if (dayText.includes('Closed')) {
        hours[days[index]] = 'Closed'
      } else {
        const match = dayText.match(/(\d{1,2}:\d{2} [AP]M) – (\d{1,2}:\d{2} [AP]M)/)
        if (match) {
          hours[days[index]] = `${match[1]} - ${match[2]}`
        } else {
          hours[days[index]] = 'Hours not available'
        }
      }
    })
    
    return hours
  }

  private estimateNoiseLevel(rating: number, reviewCount: number): 'quiet' | 'moderate' | 'lively' {
    if (rating >= 4.5 && reviewCount > 100) return 'lively'
    if (rating >= 4.0) return 'moderate'
    return 'quiet'
  }

  private isStudyFriendly(types: string[], rating: number): boolean {
    const studyFriendlyTypes = ['cafe', 'library', 'book_store']
    const hasStudyType = types.some(type => studyFriendlyTypes.includes(type))
    return hasStudyType && rating >= 3.5
  }

  private generateAmenities(types: string[]): string[] {
    const amenities = ['Free WiFi', 'Power Outlets']
    
    if (types.includes('library') || types.includes('book_store')) {
      amenities.push('Book Collection', 'Reading Areas')
    }
    if (types.includes('bakery')) {
      amenities.push('Fresh Pastries')
    }
    if (types.includes('restaurant')) {
      amenities.push('Food Available')
    }
    
    return amenities
  }

  private generateTags(types: string[]): string[] {
    const tags: string[] = []
    
    if (types.includes('cafe')) tags.push('cafe', 'coffee')
    if (types.includes('library')) tags.push('books', 'quiet', 'study-friendly')
    if (types.includes('bakery')) tags.push('pastries', 'bakery')
    if (types.includes('restaurant')) tags.push('food', 'restaurant')
    
    return tags
  }
}
