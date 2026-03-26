"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ExploreVenues() {
  const [venues, setVenues] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/organizers/venues")
      const data = await res.json()
      setVenues(data || [])
    }
    load()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gray-100  p-6">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Featured Venues
            </h2>
            <p className="text-sm text-gray-500">
              Explore featured venues in the country
            </p>
          </div>
<Link href="/venues">
 <button className="text-xs text-gray-500 hover:text-black">
            See All
          </button>
</Link>
         
        </div>

        {/* Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {venues.map((venue) => (
            <div
  key={venue.id}
  onClick={() => router.push(`/venue/${venue.id}`)}
  className="min-w-[300px] bg-white rounded-[4px] p-3 cursor-pointer"
>
  <img
    src={
      venue.images?.[0] ||
      venue.avatar ||
      venue.venueImages?.[0] ||
      "/city/c1.jpg"
    }
    alt={venue.name}
    className="h-[140px] w-full object-cover rounded-[4px] mb-3"
    onError={(e) => {
      const target = e.target as HTMLImageElement
      target.src = "/city/c1.jpg"
    }}
  />

  <h3 className="text-sm font-medium text-gray-800">
    {venue.name || "Venue Name"}
  </h3>
</div>
          ))}
        </div>

      </div>
    </div>
  )
}