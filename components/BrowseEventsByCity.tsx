"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

export default function BrowseByCity() {
  const router = useRouter()
  const [cities, setCities] = useState<any[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      const res = await apiFetch("/api/location/cities", { auth: false })
      setCities(res?.data || [])
    }
    load()
  }, [])

  // ✅ STEP SCROLL (pause → move → pause)
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const interval = setInterval(() => {
      container.scrollBy({
        left: 280, // card width
        behavior: "smooth",
      })

      // reset when end reached
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 10
      ) {
        container.scrollTo({ left: 0, behavior: "smooth" })
      }
    }, 2500) // ⏱ pause time (2.5 sec)

    return () => clearInterval(interval)
  }, [cities])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Browse by City
        </h2>
        <p className="text-sm text-gray-500">
          Discover events by cities worldwide
        </p>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
      >
        {cities.map((city, index) => {
          const bgColors = [
            "bg-green-50",
            "bg-gray-100",
            "bg-blue-50",
            "bg-red-50",
            "bg-yellow-50",
          ]

          return (
            <button
              key={city.id}
              onClick={() =>
                router.push(`/event?location=${city.name}`)
              }
              className={`min-w-[260px] flex items-center justify-center gap-3 px-6 py-5 
              ${bgColors[index % bgColors.length]} 
              rounded-[6px] hover:shadow-sm transition`}
            >
              <img
                src={city.image || "/placeholder.svg"}
                alt={city.name}
                className="w-8 h-8 object-cover rounded-[4px]"
              />

              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">
                  {city.name}
                </p>
                <p className="text-xs text-gray-500">
                  {city.country?.name}
                </p>
              </div>
            </button>
          )
        })}
      </div>

    </div>
  )
}