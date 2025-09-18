import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Study Café Locator - Find Your Perfect Study Spot",
  description:
    "Discover the best study cafés in Orange County with our comprehensive locator. Find quiet spaces, fast WiFi, and study-friendly environments.",
  keywords: "study cafés, Orange County, WiFi, quiet study, coffee shops, student spaces",
  authors: [{ name: "Study Café Locator Team" }],
  generator: "v0.app",
  openGraph: {
    title: "Study Café Locator - Find Your Perfect Study Spot",
    description: "Discover the best study cafés in Orange County with our comprehensive locator.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Café Locator",
    description: "Find your perfect study spot in Orange County",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary>
            {children}
            <Toaster />
          </ErrorBoundary>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
