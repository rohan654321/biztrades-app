"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/lib/api"

export default function BrowseByCountry() {
  const router = useRouter()
  const [countries, setCountries] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/api/location/countries", { auth: false })

        const publicCountries =
          res?.data?.filter((c: any) => {
            return (
              c.isPublic === true ||
              c.is_public === true ||
              c.public === true ||
              c.status === "public" ||
              c.visibility === "PUBLIC"
            )
          }) || []

        setCountries(publicCountries.length ? publicCountries : res?.data || [])
      } catch (error) {
        console.error("Error loading countries:", error)
      }
    }

    load()
  }, [])

  // ✅ Softer Pastel Colors (like your design)
  const bgColors = [
    "bg-green-50",
    "bg-gray-100",
    "bg-red-50",
    "bg-blue-50",
    "bg-yellow-50",
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Outer Container */}
      <div className="bg-gray-200 rounded-md p-6">

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Source by Region
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Facilitate world wholesale, retail and E-commerce businesses. Global sourcing is easy!
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {countries.map((country, index) => (
            <button
              key={country.id}
              onClick={() =>
                router.push(`/event?country=${country.name}`)
              }
              className={`
                flex items-center justify-center gap-3
                h-[70px]   /* ✅ Fixed height (important) */
                px-6
                rounded-xl
                ${bgColors[index % bgColors.length]}
                hover:shadow-md hover:scale-[1.01]
                transition-all duration-200
              `}
            >
              {/* Flag */}
              <img
                src={country.flag || "/placeholder.svg"}
                alt={country.name}
                className="w-7 h-5 object-cover rounded-sm"
              />

              {/* Name */}
              <span className="text-[15px] font-medium text-gray-800">
                {country.name}
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}