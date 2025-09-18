"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { CafeDetailView } from "@/components/cafe-detail-view"
import { useCafe } from "@/lib/hooks/use-cafes"
import { Loader } from "lucide-react"

interface CafePageProps {
  params: Promise<{ id: string }>
}

export default function CafePage({ params }: CafePageProps) {
  const { id } = use(params)
  const { cafe, reviews, isLoading, error } = useCafe(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader className="h-5 w-5 animate-spin" />
          Loading café details...
        </div>
      </div>
    )
  }

  if (error || !cafe) {
    notFound()
  }

  return <CafeDetailView cafe={cafe} reviews={reviews} />
}
