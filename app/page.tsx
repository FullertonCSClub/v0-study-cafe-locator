"use client"

import { useState } from "react"
import { MapExplorer } from "@/components/map-explorer"
import type { SearchFilters } from "@/lib/types"

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>({})

  return (
    <div className="h-screen flex flex-col">
      <MapExplorer filters={filters} onFiltersChange={setFilters} />
    </div>
  )
}
