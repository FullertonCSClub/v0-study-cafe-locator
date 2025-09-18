"use client"

import { useEffect } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <EmptyState
          icon={<AlertTriangle className="h-16 w-16" />}
          title="Something went wrong"
          description="An unexpected error occurred. Please try again or contact support if the problem persists."
          action={{
            label: "Try Again",
            onClick: reset,
          }}
        />
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 p-4 bg-muted rounded-lg">
            <summary className="cursor-pointer text-sm font-medium">Error Details</summary>
            <pre className="mt-2 text-xs overflow-auto">{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
  )
}
