"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  cafeId: string
  onSubmit: () => void
}

export function ReviewForm({ cafeId, onSubmit }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    userName: "",
    rating: 0,
    comment: "",
    studyRating: 0,
    wifiRating: 0,
    noiseRating: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.userName.trim()) {
      newErrors.userName = "Name is required"
    }

    if (formData.rating === 0) {
      newErrors.rating = "Overall rating is required"
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Review comment is required"
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Review must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRatingChange = (field: string, rating: number) => {
    setFormData((prev) => ({ ...prev, [field]: rating }))
    // Clear error when user provides input
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user provides input
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/cafes/${cafeId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit review")
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for your review! It will be visible shortly.",
        variant: "success",
      })

      onSubmit()
      setFormData({
        userName: "",
        rating: 0,
        comment: "",
        studyRating: 0,
        wifiRating: 0,
        noiseRating: 0,
      })
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const RatingInput = ({
    label,
    value,
    onChange,
    error,
    required = false,
  }: {
    label: string
    value: number
    onChange: (rating: number) => void
    error?: string
    required?: boolean
  }) => (
    <div className="space-y-2">
      <Label className="text-sm">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 hover:scale-110 transition-transform"
            disabled={isSubmitting}
          >
            <Star
              className={cn(
                "h-5 w-5 transition-colors",
                star <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400",
              )}
            />
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="userName">
            Your Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="userName"
            value={formData.userName}
            onChange={(e) => handleInputChange("userName", e.target.value)}
            placeholder="Enter your name"
            disabled={isSubmitting}
            className={errors.userName ? "border-destructive" : ""}
          />
          {errors.userName && <p className="text-sm text-destructive">{errors.userName}</p>}
        </div>

        <RatingInput
          label="Overall Rating"
          value={formData.rating}
          onChange={(rating) => handleRatingChange("rating", rating)}
          error={errors.rating}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RatingInput
          label="Study Environment"
          value={formData.studyRating}
          onChange={(rating) => handleRatingChange("studyRating", rating)}
        />

        <RatingInput
          label="WiFi Quality"
          value={formData.wifiRating}
          onChange={(rating) => handleRatingChange("wifiRating", rating)}
        />

        <RatingInput
          label="Noise Level"
          value={formData.noiseRating}
          onChange={(rating) => handleRatingChange("noiseRating", rating)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">
          Your Review <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => handleInputChange("comment", e.target.value)}
          placeholder="Share your experience at this café..."
          rows={4}
          disabled={isSubmitting}
          className={errors.comment ? "border-destructive" : ""}
        />
        {errors.comment && <p className="text-sm text-destructive">{errors.comment}</p>}
        <p className="text-xs text-muted-foreground">{formData.comment.length}/500 characters</p>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onSubmit} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
