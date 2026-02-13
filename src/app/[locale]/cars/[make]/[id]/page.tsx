import { notFound } from "next/navigation"
import { Suspense } from "react"
import { CURATED_CARS } from "@/lib/curatedCars"
import { CarDetailClient } from "./CarDetailClient"

interface CarDetailPageProps {
  params: Promise<{ make: string; id: string }>
}

export async function generateMetadata({ params }: CarDetailPageProps) {
  const { id } = await params

  const car = CURATED_CARS.find(c => c.id === id)

  if (!car) {
    return { title: "Not Found | Monza Lab" }
  }

  return {
    title: `${car.title} | Monza Lab`,
    description: `${car.thesis.slice(0, 160)}...`,
    openGraph: {
      title: `${car.title} | Monza Lab`,
      description: car.thesis,
      images: [{ url: car.image }],
    },
  }
}

export async function generateStaticParams() {
  return CURATED_CARS.map(car => ({
    make: car.make.toLowerCase().replace(/\s+/g, "-"),
    id: car.id,
  }))
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params

  const car = CURATED_CARS.find(c => c.id === id)

  if (!car) {
    notFound()
  }

  // Find similar cars (same category or same make)
  const similarCars = CURATED_CARS.filter(
    c => c.id !== car.id && (c.category === car.category || c.make === car.make)
  ).slice(0, 4)

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-10 w-10 rounded-full border-2 border-zinc-800" />
              <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-zinc-500">Loading...</p>
          </div>
        </div>
      }
    >
      <CarDetailClient car={car} similarCars={similarCars} />
    </Suspense>
  )
}
