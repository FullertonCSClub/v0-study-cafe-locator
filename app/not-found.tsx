import { EmptyState } from "@/components/ui/empty-state"
import { MapPin } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <EmptyState
          icon={<MapPin className="h-16 w-16" />}
          title="Page Not Found"
          description="The page you're looking for doesn't exist or may have been moved."
          action={{
            label: "Go Home",
            onClick: () => (window.location.href = "/"),
          }}
        />
      </div>
    </div>
  )
}
