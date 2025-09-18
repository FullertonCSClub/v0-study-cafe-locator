"use client"

import useSWR from "swr"
import type { SearchFilters } from "../types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useCafes(filters?: SearchFilters) {
  const params = new URLSearchParams()

  if (filters?.query) params.set("query", filters.query)
  if (filters?.amenities?.length) params.set("amenities", filters.amenities.join(","))
  if (filters?.priceLevel?.length) params.set("priceLevel", filters.priceLevel.join(","))
  if (filters?.rating) params.set("rating", filters.rating.toString())
  if (filters?.noiseLevel?.length) params.set("noiseLevel", filters.noiseLevel.join(","))
  if (filters?.studyFriendly !== undefined) params.set("studyFriendly", filters.studyFriendly.toString())
  if (filters?.openNow !== undefined) params.set("openNow", filters.openNow.toString())
  if (filters?.distance) params.set("distance", filters.distance.toString())
  if (filters?.location) {
    params.set("lat", filters.location.lat.toString())
    params.set("lng", filters.location.lng.toString())
  }

  const url = `/api/cafes${params.toString() ? `?${params.toString()}` : ""}`

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    cafes: data?.cafes || [],
    total: data?.total || 0,
    filters: data?.filters,
    isLoading,
    error,
    mutate,
  }
}

export function useCafe(id: string) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/cafes/${id}` : null, fetcher)

  return {
    cafe: data?.cafe,
    reviews: data?.reviews || [],
    reviewCount: data?.reviewCount || 0,
    isLoading,
    error,
    mutate,
  }
}

export function useSearchSuggestions(query: string) {
  const { data, error, isLoading } = useSWR(
    query && query.length >= 2 ? `/api/search/suggestions?q=${encodeURIComponent(query)}` : null,
    fetcher,
  )

  return {
    suggestions: data?.suggestions || [],
    isLoading,
    error,
  }
}
