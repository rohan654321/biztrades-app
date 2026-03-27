"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

export default function BrowseByCity() {
  const router = useRouter()
  const [cities, setCities] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/api/location/cities", { auth: false })

        console.log("Cities API Response:", res?.data) // ✅ DEBUG

        // ✅ UNIVERSAL PUBLIC FILTER (handles all cases)
        const publicCities =
          res?.data?.filter((c: any) => {
            return (
              c.isPublic === true ||
              c.is_public === true ||
              c.public === true ||
              c.status === "public" ||
              c.visibility === "PUBLIC"
            )
          }) || []

        // ⚠️ If no public field exists, fallback to show all
        setCities(publicCities.length ? publicCities : res?.data || [])
      } catch (error) {
        console.error("Error loading cities:", error)
      }
    }

    load()
  }, [])

  const bgColors = [
    "bg-green-100",
    "bg-gray-200",
    "bg-blue-100",
    "bg-red-100",
    "bg-yellow-100",
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Outer Container */}
      <div className="bg-white rounded-[4px] p-6">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Browse by City
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Discover events by cities worldwide
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => (
            <button
              key={city.id}
              onClick={() =>
                router.push(`/event?location=${city.name}`)
              }
              className={`
                flex items-center justify-center gap-4
                py-6 px-6
                rounded-lg
                ${bgColors[index % bgColors.length]}
                hover:scale-[1.02] transition-all duration-200
              `}
            >
              {/* Image */}
              <img
                src={city.image || "/placeholder.svg"}
                alt={city.name}
                className="w-10 h-10 object-cover rounded-md"
              />

              {/* Text */}
              <div className="text-left">
                <p className="text-base font-medium text-gray-900">
                  {city.name}
                </p>
                <p className="text-xs text-gray-600">
                  {city.country?.name || "Unknown"}
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>

    </div>
  )
}