"use server"

export async function getGoogleMapsApiKey(): Promise<string | null> {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null
}
