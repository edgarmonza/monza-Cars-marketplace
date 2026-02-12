import type { Metadata } from "next"
import { Suspense } from "react"
import AuctionsClient from "./AuctionsClient"

export const metadata: Metadata = {
  title: "Live Auctions | Monza Lab",
  description:
    "Browse and analyze collector car auctions across Bring a Trailer, Cars & Bids, RM Sotheby's, and more. Get AI-powered insights before you bid.",
  openGraph: {
    title: "Live Auctions | Monza Lab",
    description:
      "Browse and analyze collector car auctions across all major platforms.",
  },
}

export default function AuctionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-10 w-10 rounded-full border-2 border-zinc-800" />
              <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-zinc-500">Loading auctions...</p>
          </div>
        </div>
      }
    >
      <AuctionsClient />
    </Suspense>
  )
}
