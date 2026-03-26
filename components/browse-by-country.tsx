"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

export default function BrowseByCountry() {
  const router = useRouter()
  const [countries, setCountries] = useState<any[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const load = async () => {
      const res = await apiFetch("/api/location/countries", { auth: false })
      setCountries(res?.data || [])
    }
    load()
  }, [])

  // ✅ STEP AUTO SCROLL (same as city)
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const interval = setInterval(() => {
      container.scrollBy({
        left: 300,
        behavior: "smooth",
      })

      // reset when end reached
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 10
      ) {
        container.scrollTo({ left: 0, behavior: "smooth" })
      }
    }, 2500)

    return () => clearInterval(interval)
  }, [countries])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Source by Region
        </h2>
        <p className="text-sm text-gray-500">
          Facilitate world wholesale, retail and E-commerce businesses. Global sourcing is easy!
        </p>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
      >
        {countries.map((country, index) => {
          const bgColors = [
            "bg-green-50",
            "bg-gray-100",
            "bg-red-50",
            "bg-blue-50",
            "bg-yellow-50",
          ]

          return (
            <button
              key={country.id}
              onClick={() => router.push(`/event?country=${country.name}`)}
              className={`min-w-[280px] flex items-center justify-center gap-3 px-6 py-6 
              ${bgColors[index % bgColors.length]} 
              rounded-[6px] hover:shadow-sm transition`}
            >
              <img
                src={country.flag || "/placeholder.svg"}
                alt={country.name}
                className="w-8 h-5 object-cover rounded-[2px]"
              />

              <span className="text-base font-medium text-gray-800">
                {country.name}
              </span>
            </button>
          )
        })}
      </div>

    </div>
  )
}